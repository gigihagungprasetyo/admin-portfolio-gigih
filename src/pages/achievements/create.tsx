import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Upload, message, Card } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../utility";
import { v4 as uuidv4 } from "uuid";

export const AchievementCreate = () => {
  const { formProps, saveButtonProps, onFinish } = useForm();

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file } = options;
    const filePath = `achievements/${uuidv4()}-${file.name}`;

    try {
      const { error } = await supabaseClient.storage
        .from("achievements")   // bucket
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabaseClient.storage
        .from("achievements")
        .getPublicUrl(filePath);

      onSuccess(data.publicUrl);
      message.success("Image uploaded!");
    } catch (err) {
      onError({ err });
      message.error("Upload failed.");
    }
  };

  const handleFinish = (values: any) => {
    const imgFile = values.image?.fileList?.[0];
    const imgUrl = imgFile?.response || imgFile?.url;

    onFinish({
      ...values,
      image: imgUrl,
    });
  };

  return (
    <Create saveButtonProps={saveButtonProps} title="Add Achievement">
      <Form {...formProps} onFinish={handleFinish} layout="vertical">

        <Card title="Achievement Info" className="mb-6">

          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input placeholder="Ex: UI/UX Competition Winner" />
          </Form.Item>

          <Form.Item label="Issuer" name="issuer" rules={[{ required: true }]}>
            <Input placeholder="Ex: Google, Dicoding, Kampus, etc." />
          </Form.Item>

          <Form.Item label="Year" name="year" rules={[{ required: true }]}>
            <Input placeholder="Ex: 2024" />
          </Form.Item>

          <Form.Item label="Credential URL" name="credential_url">
            <Input placeholder="Optional credential link" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Optional achievement description" />
          </Form.Item>

          <Form.Item label="Image" name="image">
            <Upload.Dragger
              name="file"
              customRequest={uploadImage}
              maxCount={1}
              accept="image/*"
              listType="picture"
            >
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Upload Achievement Image</p>
            </Upload.Dragger>
          </Form.Item>

        </Card>
      </Form>
    </Create>
  );
};
