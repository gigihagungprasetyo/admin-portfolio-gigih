import { List, useTable, EditButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Image, Tag, Typography } from "antd";

export const SkillList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    sorters: { initial: [{ field: "id", order: "desc" }] },
  });

  return (
    <List title={<Typography.Title level={3}>Skills</Typography.Title>}>
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{ ...tableProps.pagination, pageSize: 10 }}
      >
        <Table.Column title="ID" dataIndex="id" width={60} />

        <Table.Column
          title="Icon"
          dataIndex="icon_url"
          width={100}
          render={(value) => (
            <Image
              width={40}
              height={40}
              src={value}
              style={{ objectFit: "contain" }}
              fallback="https://placehold.co/40x40?text=No+Icon"
            />
          )}
        />

        <Table.Column
          title="Name"
          dataIndex="name"
          render={(value) => <Typography.Text strong>{value}</Typography.Text>}
        />

        <Table.Column
          title="Category"
          dataIndex="category"
          render={(value) => <Tag color="blue">{value}</Tag>}
        />

        <Table.Column
          title="Actions"
          width={100}
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
