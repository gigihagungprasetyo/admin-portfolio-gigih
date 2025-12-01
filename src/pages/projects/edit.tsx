import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Upload, message, Select, InputNumber, Switch, Card, Row, Col } from "antd";
import { UploadOutlined, InboxOutlined, LinkOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../utility"; 
import { v4 as uuidv4 } from 'uuid'; 

export const ProjectEdit = () => {
  const { formProps, saveButtonProps, form, onFinish, queryResult } = useForm();
  const record = queryResult?.data?.data;
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    form.setFieldValue("slug", slug);
  };

  const getUploadHandler = (folderName: string) => async (options: any) => {
    const { onSuccess, onError, file } = options;
    const filePath = `${folderName}/${uuidv4()}-${file.name}`; 

    try {
      const { error } = await supabaseClient.storage.from('projects').upload(filePath, file);
      if (error) throw error;
      const { data } = supabaseClient.storage.from('projects').getPublicUrl(filePath);
      onSuccess(data.publicUrl);
      message.success(`Upload berhasil!`);
    } catch (err) {
      console.error(err);
      onError({ err });
      message.error("Gagal upload.");
    }
  };

  const handleOnFinish = (values: any) => {
    let thumbnailUrl = values.thumbnail;
    if (values.thumbnail?.fileList) {
        thumbnailUrl = values.thumbnail.fileList[0]?.response || values.thumbnail.fileList[0]?.url;
    }

    let galleryUrls = values.gallery;
    if (values.gallery?.fileList) {
        galleryUrls = values.gallery.fileList.map((f: any) => f.response || f.url).filter((url: string) => url);
    } else if (Array.isArray(values.gallery)) {
        galleryUrls = values.gallery; 
    }

    const isFeaturedNumber = values.is_featured ? 1 : 0;

    onFinish({
        ...values,
        thumbnail: thumbnailUrl,
        gallery: galleryUrls,
        is_featured: isFeaturedNumber,
    });
  };

  const urlToFileList = (url: string) => {
    if (!url || typeof url !== 'string') return [];
    return [{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: url,
        response: url,
    }];
  };

  const urlsToFileList = (urls: string[]) => {
    if (!urls || !Array.isArray(urls)) return [];
    return urls.map((url, index) => ({
        uid: `-${index}`,
        name: `image-${index}.png`,
        status: 'done',
        url: url,
        response: url,
    }));
  };

  return (
    <Edit saveButtonProps={saveButtonProps} title="Edit Project">
      <Form {...formProps} onFinish={handleOnFinish} layout="vertical">
        
        <Card title="Basic Info" className="mb-6 shadow-sm">
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                        <Input onChange={handleTitleChange} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
                        <Input disabled />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { value: 'web-dev', label: 'Web Development' },
                                { value: 'data-science', label: 'Data Science' },
                                { value: 'machine-learning', label: 'Machine Learning' },
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Year" name="year" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item 
                name="is_featured" 
                valuePropName="checked" 
                getValueProps={(value) => ({ checked: value === 1 || value === true })}
            >
                <Switch checkedChildren="Featured" unCheckedChildren="Standard" />
            </Form.Item>
        </Card>

        <Card title="Case Study" className="mb-6 shadow-sm">
            <Form.Item label="Short Summary" name="description" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
            <Form.Item label="The Challenge" name="challenge"><Input.TextArea rows={4} /></Form.Item>
            <Form.Item label="The Solution" name="solution"><Input.TextArea rows={4} /></Form.Item>
        </Card>

        <Card title="Tech & Media" className="mb-6 shadow-sm">
            <Form.Item label="Tech Stack" name="tech_stack">
                <Select mode="tags" tokenSeparators={[',']} />
            </Form.Item>

            <Form.Item 
                label="Thumbnail Image" 
                name="thumbnail"
                getValueProps={(value) => ({ fileList: urlToFileList(value) })}
            >
                <Upload.Dragger 
                    name="file"
                    customRequest={getUploadHandler('thumbnails')}
                    maxCount={1}
                    listType="picture"
                    accept="image/*"
                >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Change Thumbnail</p>
                </Upload.Dragger>
            </Form.Item>

            <Form.Item 
                label="Project Gallery" 
                name="gallery"
                getValueProps={(value) => ({ fileList: urlsToFileList(value) })}
            >
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
                <Col span={12}><Form.Item label="Demo URL" name="demo_url"><Input prefix={<LinkOutlined />} /></Form.Item></Col>
                <Col span={12}><Form.Item label="Repo URL" name="repo_url"><Input prefix={<LinkOutlined />} /></Form.Item></Col>
            </Row>
        </Card>

      </Form>
    </Edit>
  );
};