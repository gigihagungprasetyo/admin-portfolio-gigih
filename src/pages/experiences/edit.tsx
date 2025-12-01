import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Upload, message, Select, DatePicker, Switch, Card, Row, Col } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../utility"; 
import { v4 as uuidv4 } from 'uuid'; 
import dayjs from "dayjs";

export const ExperienceEdit = () => {
  const { formProps, saveButtonProps, form, onFinish } = useForm();
  const isCurrent = Form.useWatch("is_current", form);

  const customUpload = async (options: any) => {
    const { onSuccess, onError, file } = options;
    const fileName = `company-logos/${uuidv4()}-${file.name}`; 
    try {
      const { error } = await supabaseClient.storage.from('experience').upload(fileName, file);
      if (error) throw error;
      const { data } = supabaseClient.storage.from('experience').getPublicUrl(fileName);
      onSuccess(data.publicUrl);
      message.success("Logo berhasil diupload!");
    } catch (err) {
      console.error(err); onError({ err }); message.error("Gagal upload.");
    }
  };

  const handleOnFinish = (values: any) => {
    let logoUrl = values.logo;
    if (values.logo?.fileList) {
        logoUrl = values.logo.fileList[0]?.response || values.logo.fileList[0]?.url;
    }

    const formattedStart = values.start_date ? dayjs(values.start_date).format('YYYY-MM-DD') : null;
    let formattedEnd = null;
    if (!values.is_current && values.end_date) {
        formattedEnd = dayjs(values.end_date).format('YYYY-MM-DD');
    }

    onFinish({
        ...values,
        logo: logoUrl,
        start_date: formattedStart,
        end_date: formattedEnd,
        is_current: values.is_current,
    });
  };

  const urlToFileList = (url: string) => {
    if (!url || typeof url !== 'string') return [];
    return [{ uid: '-1', name: 'logo.png', status: 'done', url: url, response: url }];
  };

  return (
    <Edit saveButtonProps={saveButtonProps} title="Edit Experience">
      <Form {...formProps} onFinish={handleOnFinish} layout="vertical">
        <Card title="Work History" className="shadow-sm">
            <Row gutter={24}>
                <Col span={12}><Form.Item label="Company" name="company"><Input /></Form.Item></Col>
                <Col span={12}><Form.Item label="Role" name="role"><Input /></Form.Item></Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}><Form.Item label="Location" name="location"><Input /></Form.Item></Col>
                <Col span={12}>
                    <Form.Item label="Tech Stack" name="technologies">
                        <Select mode="tags" tokenSeparators={[',']} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Company Logo" name="logo" getValueProps={(value) => ({ fileList: urlToFileList(value) })}>
                <Upload.Dragger name="file" customRequest={customUpload} maxCount={1} listType="picture" accept="image/*">
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Change Logo</p>
                </Upload.Dragger>
            </Form.Item>

            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item 
                        label="Start Date" 
                        name="start_date" 
                        getValueProps={(value) => ({ value: value ? dayjs(value) : "" })}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
                    </Form.Item>
                </Col>
                
                <Col span={8} className="flex items-center pt-6">
                    <Form.Item name="is_current" valuePropName="checked" noStyle>
                        <Switch />
                    </Form.Item>
                    <span className="ml-2">Current Job?</span>
                </Col>

                {!isCurrent && (
                    <Col span={8}>
                        <Form.Item 
                            label="End Date" 
                            name="end_date"
                            getValueProps={(value) => ({ value: value ? dayjs(value) : "" })}
                        >
                            <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
                        </Form.Item>
                    </Col>
                )}
            </Row>

            <Form.Item label="Description" name="description"><Input.TextArea rows={4} /></Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};