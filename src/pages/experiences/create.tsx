import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Upload, message, Select, DatePicker, Switch, Card, Row, Col } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../utility"; 
import { v4 as uuidv4 } from 'uuid'; 
import dayjs from "dayjs"; 

export const ExperienceCreate = () => {
  const { formProps, saveButtonProps, form, onFinish } = useForm();
  const isCurrent = Form.useWatch("is_current", form);
  const customUpload = async (options: any) => {
    const { onSuccess, onError, file } = options;
    const fileName = `company-logos/${uuidv4()}-${file.name}`; 

    try {
      const { error } = await supabaseClient.storage
        .from('experience') 
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabaseClient.storage
        .from('experience')
        .getPublicUrl(fileName);

      onSuccess(data.publicUrl);
      message.success("Logo berhasil diupload!");
    } catch (err) {
      console.error(err);
      onError({ err });
      message.error("Gagal upload logo. Cek nama bucket 'experience'.");
    }
  };

  const handleOnFinish = (values: any) => {
    const logoFile = values.logo?.fileList?.[0];
    const logoUrl = logoFile?.response || logoFile?.url;
    const formattedStart = values.start_date ? dayjs(values.start_date).format('YYYY-MM-DD') : null;
    
    let formattedEnd = null;
    if (!values.is_current && values.end_date) {
        formattedEnd = dayjs(values.end_date).format('YYYY-MM-DD');
    }

    const isCurrentNumber = values.is_current ? 1 : 0;

    onFinish({
        ...values,
        logo: logoUrl,
        start_date: formattedStart,
        end_date: formattedEnd,
        is_current: isCurrentNumber,
    });
  };

  return (
    <Create saveButtonProps={saveButtonProps} title="Add Work Experience">
      <Form {...formProps} onFinish={handleOnFinish} layout="vertical">
        
        <Card title="Work History" className="shadow-sm">
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Company Name" name="company" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Google" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Job Title (Role)" name="role" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Senior Frontend Dev" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Location" name="location">
                        <Input placeholder="e.g. Malang (Remote)" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Tech Stack" name="technologies">
                        <Select 
                            mode="tags" 
                            placeholder="Type & Enter (Laravel, React)" 
                            tokenSeparators={[',']} 
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Company Logo" name="logo">
                <Upload.Dragger 
                    name="file"
                    customRequest={customUpload}
                    maxCount={1}
                    listType="picture"
                    accept="image/*"
                >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Upload Logo</p>
                </Upload.Dragger>
            </Form.Item>

            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item label="Start Date" name="start_date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
                    </Form.Item>
                </Col>
                
                <Col span={8} className="flex items-center pt-6">
                    <Form.Item name="is_current" valuePropName="checked" noStyle>
                        <Switch />
                    </Form.Item>
                    <span className="ml-2">I currently work here</span>
                </Col>

                {!isCurrent && (
                    <Col span={8}>
                        <Form.Item 
                            label="End Date" 
                            name="end_date"
                            rules={[{ required: !isCurrent, message: "End Date required" }]}
                        >
                            <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
                        </Form.Item>
                    </Col>
                )}
            </Row>

            <Form.Item label="Description" name="description">
                <Input.TextArea rows={4} placeholder="Describe your responsibilities..." />
            </Form.Item>

        </Card>
      </Form>
    </Create>
  );
};