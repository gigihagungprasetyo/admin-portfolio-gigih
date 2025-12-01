import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Upload, message, Card, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../utility";
import { v4 as uuidv4 } from "uuid";

export const SkillCreate = () => {
  const { formProps, saveButtonProps, onFinish } = useForm();

  const uploadIcon = async (options: any) => {
    const { onSuccess, onError, file } = options;
    const filePath = `skills/${uuidv4()}-${file.name}`;

    try {
      const { error } = await supabaseClient.storage
        .from("skills")
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabaseClient.storage
        .from("skills")
        .getPublicUrl(filePath);

      onSuccess(data.publicUrl);
      message.success("Upload icon berhasil!");
    } catch (err) {
      onError({ err });
      message.error("Gagal upload icon.");
    }
  };

  const handleFinish = (values: any) => {
    const iconFile = values.icon_url?.fileList?.[0];
    const iconUrl = iconFile?.response || iconFile?.url;

    onFinish({ ...values, icon_url: iconUrl });
  };

  return (
    <Create saveButtonProps={saveButtonProps} title="Add New Skill">
      <Form {...formProps} onFinish={handleFinish} layout="vertical">
        
        <Card title="Skill Info" className="mb-6">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Skill name (ex: React, Laravel)" />
          </Form.Item>

          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select
                placeholder="Select category"
                options={[
                { value: "web-dev", label: "Web Development" },
                { value: "data-science", label: "Data Science" },
                { value: "machine-learning", label: "Machine Learning" },
                { value: "tools", label: "Tools" },
                ]}
            />
        </Form.Item>

          <Form.Item label="Icon" name="icon_url">
            <Upload.Dragger
              name="file"
              customRequest={uploadIcon}
              maxCount={1}
              accept="image/*"
              listType="picture"
            >
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Upload Skill Icon</p>
            </Upload.Dragger>
          </Form.Item>
        </Card>

      </Form>
    </Create>
  );
};
