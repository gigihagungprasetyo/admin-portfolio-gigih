import { List, useTable, EditButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Image, Tag } from "antd";

export const ProjectList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    sorters: { initial: [{ field: "id", order: "desc" }] }
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        
        <Table.Column dataIndex="id" title="ID" width={50} />

        <Table.Column
            dataIndex="thumbnail"
            title="Thumbnail"
            render={(value) => (
                <Image 
                    width={80} 
                    height={50} 
                    src={value ? value : "error"} 
                    alt="thumb"
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                    fallback="https://placehold.co/80x50?text=No+Img"
                />
            )}
        />

        <Table.Column 
            dataIndex="title" 
            title="Title" 
            render={(value) => <span style={{ fontWeight: 'bold' }}>{value}</span>}
        />

        <Table.Column 
            dataIndex="category" 
            title="Category"
            render={(value) => <Tag color="blue">{value}</Tag>} 
        />

        <Table.Column
            dataIndex="is_featured"
            title="Featured"
            render={(value) => (
                value === 1 || value === true 
                ? <Tag color="green">Featured</Tag> 
                : <Tag color="default">Standard</Tag>
            )}
        />

        <Table.Column dataIndex="year" title="Year" />

        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: any) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};