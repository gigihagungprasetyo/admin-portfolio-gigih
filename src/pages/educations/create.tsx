import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Upload, message, Card } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../utility";
import { v4 as uuidv4 } from "uuid";

export const EducationCreate = () => {
  const { formProps, saveButtonProps, onFinish } = useForm();

  const uploadLogo = async (options: any) => {
    const { onSuccess, onError, file } = options;
    const filePath = `education/${uuidv4()}-${file.name}`;

    try {
      const { error } = await supabaseClient.storage
        .from("education-logos")
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabaseClient.storage
        .from("education-logos")
        .getPublicUrl(filePath);

      onSuccess(data.publicUrl);
      message.success("Logo uploaded!");
    } catch (err) {
      onError({ err });
      message.error("Upload failed.");
    }
  };

  const handleFinish = (values: any) => {
    const logoFile = values.logo?.fileList?.[0];
    const logoUrl = logoFile?.response || logoFile?.url;

    onFinish({
      ...values,
      logo: logoUrl,
    });
  };

  return (
    <Create saveButtonProps={saveButtonProps} title="Add Education">
      <Form {...formProps} onFinish={handleFinish} layout="vertical">

        <Card title="Education Info" className="mb-6">
          <Form.Item label="Institution" name="institution" rules={[{ required: true }]}>
            <Input placeholder="Ex: Universitas Brawijaya" />
          </Form.Item>

          <Form.Item label="Degree" name="degree" rules={[{ required: true }]}>
            <Input placeholder="Ex: Bachelor's Degree" />
          </Form.Item>

          <Form.Item label="Major" name="major" rules={[{ required: true }]}>
            <Input placeholder="Ex: Informatics Engineering" />
          </Form.Item>

          <Form.Item label="Year" name="year" rules={[{ required: true }]}>
            <Input placeholder="Ex: 2020 - 2024" />
          </Form.Item>

          <Form.Item label="GPA" name="gpa">
            <Input placeholder="Ex: 3.85" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Optional description" />
          </Form.Item>

          <Form.Item label="Logo" name="logo">
            <Upload.Dragger
              name="file"
              customRequest={uploadLogo}
              maxCount={1}
              listType="picture"
              accept="image/*"
            >
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Upload Logo</p>
            </Upload.Dragger>
          </Form.Item>
        </Card>

      </Form>
    </Create>
  );
};
