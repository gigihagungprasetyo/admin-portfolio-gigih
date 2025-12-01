import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Upload, message, Select, InputNumber, Switch, Card, Row, Col } from "antd";
import { UploadOutlined, InboxOutlined, LinkOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../utility"; 
import { v4 as uuidv4 } from 'uuid'; 

export const ProjectCreate = () => {
  const { formProps, saveButtonProps, form, onFinish } = useForm();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    form.setFieldValue("slug", slug);
  };

  const getUploadHandler = (folderName: string) => async (options: any) => {
    const { onSuccess, onError, file } = options;
    const filePath = `${folderName}/${uuidv4()}-${file.name}`; 

    try {
      const { error } = await supabaseClient.storage
        .from('projects')
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabaseClient.storage
        .from('projects')
        .getPublicUrl(filePath);

      onSuccess(data.publicUrl);
      message.success(`Upload ke ${folderName} berhasil!`);
    } catch (err) {
      console.error("Upload Error:", err);
      onError({ err });
      message.error("Gagal upload. Cek Policy Supabase.");
    }
  };

  const handleOnFinish = (values: any) => {
    const thumbnailFile = values.thumbnail?.fileList?.[0];
    const thumbnailUrl = thumbnailFile?.response || thumbnailFile?.url;
    const galleryFiles = values.gallery?.fileList || [];
    const galleryUrls = galleryFiles.map((f: any) => f.response || f.url).filter((url: string) => url);
    const isFeaturedNumber = values.is_featured ? 1 : 0;

    onFinish({
        ...values,
        thumbnail: thumbnailUrl,
        gallery: galleryUrls,
        is_featured: isFeaturedNumber,
    });
  };

  return (
    <Create saveButtonProps={saveButtonProps} title="Create New Project">
      <Form {...formProps} onFinish={handleOnFinish} layout="vertical">
        
        <Card title="Basic Info" className="mb-6 shadow-sm">
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                        <Input onChange={handleTitleChange} placeholder="Project Name" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
                        <Input disabled placeholder="project-slug-url" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                        <Select
                            placeholder="Select Category"
                            options={[
                                { value: 'web-dev', label: 'Web Development' },
                                { value: 'data-science', label: 'Data Science' },
                                { value: 'machine-learning', label: 'Machine Learning' },
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Year" name="year" initialValue={new Date().getFullYear()} rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="is_featured" valuePropName="checked" initialValue={false}>
                <Switch checkedChildren="Featured" unCheckedChildren="Standard" />
            </Form.Item>
        </Card>

        <Card title="Case Study" className="mb-6 shadow-sm">
            <Form.Item label="Short Summary" name="description" rules={[{ required: true }]}>
                <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="The Challenge" name="challenge">
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label="The Solution" name="solution">
                <Input.TextArea rows={4} />
            </Form.Item>
        </Card>

        <Card title="Tech & Media" className="mb-6 shadow-sm">
            <Form.Item label="Tech Stack" name="tech_stack">
                <Select mode="tags" placeholder="Ex: Laravel, React" tokenSeparators={[',']} />
            </Form.Item>

            <Form.Item label="Thumbnail Image" name="thumbnail">
                <Upload.Dragger 
                    name="file"
                    customRequest={getUploadHandler('thumbnails')}
                    maxCount={1}
                    listType="picture"
                    accept="image/*"
                >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Upload Thumbnail (Single)</p>
                </Upload.Dragger>
            </Form.Item>

            <Form.Item label="Project Gallery" name="gallery">
                <Upload.Dragger 
                    name="file"
                    multiple={true}
                    customRequest={getUploadHandler('gallery')}
                    listType="picture-card"
                    accept="image/*"
                >
                    <div className="flex flex-col items-center">
                        <UploadOutlined />
                        <span className="mt-2 text-xs">Add Image</span>
                    </div>
                </Upload.Dragger>
            </Form.Item>
        </Card>

        <Card title="Links" className="mb-6 shadow-sm">
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Demo URL" name="demo_url">
                        <Input prefix={<LinkOutlined />} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Repo URL" name="repo_url">
                        <Input prefix={<LinkOutlined />} />
                    </Form.Item>
                </Col>
            </Row>
        </Card>

      </Form>
    </Create>
  );
};