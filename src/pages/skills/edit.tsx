import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Upload, message, Card, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../utility";
import { v4 as uuidv4 } from "uuid";

export const SkillEdit = () => {
  const { formProps, saveButtonProps, onFinish, queryResult } = useForm();
  const record = queryResult?.data?.data;

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

  const fileListFromUrl = (url: string) => {
    if (!url) return [];
    return [
      {
        uid: "-1",
        name: "icon.png",
        status: "done",
        url,
        response: url,
      },
    ];
  };

  const handleFinish = (values: any) => {
    const iconFile = values.icon_url?.fileList?.[0];
    const iconUrl = iconFile?.response || iconFile?.url;

    onFinish({
      ...values,
      icon_url: iconUrl,
    });
  };

  return (
    <Edit saveButtonProps={saveButtonProps} title="Edit Skill">
      <Form {...formProps} onFinish={handleFinish} layout="vertical">
        
        <Card title="Skill Info" className="mb-6">
          
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select
                options={[
                { value: "web-dev", label: "Web Development" },
                { value: "data-science", label: "Data Science" },
                { value: "machine-learning", label: "Machine Learning" },
                { value: "tools", label: "Tools" },
                ]}
            />
        </Form.Item>

          <Form.Item
            label="Icon"
            name="icon_url"
            getValueProps={(value) => ({ fileList: fileListFromUrl(value) })}
          >
            <Upload.Dragger
              name="file"
              customRequest={uploadIcon}
              maxCount={1}
              accept="image/*"
              listType="picture"
            >
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Upload New Icon</p>
            </Upload.Dragger>
          </Form.Item>

        </Card>

      </Form>
    </Edit>
  );
};
