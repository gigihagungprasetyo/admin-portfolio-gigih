import { List, useTable, EditButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Image, Typography, Tag } from "antd";

export const EducationList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    sorters: { initial: [{ field: "id", order: "desc" }] },
  });

  return (
    <List title={<Typography.Title level={3}>Education</Typography.Title>}>
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{ ...tableProps.pagination, pageSize: 10 }}
      >
        <Table.Column
          title="Logo"
          dataIndex="logo"
          width={100}
          render={(value) => (
            <Image
              width={50}
              height={50}
              src={value}
              style={{ objectFit: "contain" }}
              fallback="https://placehold.co/50x50?text=Logo"
            />
          )}
        />

        <Table.Column
          title="Institution"
          dataIndex="institution"
          render={(value) => <Typography.Text strong>{value}</Typography.Text>}
        />

        <Table.Column title="Degree" dataIndex="degree" />

        <Table.Column title="Major" dataIndex="major" />

        <Table.Column
          title="Year"
          dataIndex="year"
          render={(value) => <Tag color="blue">{value}</Tag>}
        />

        <Table.Column
          title="GPA"
          dataIndex="gpa"
          render={(value) =>
            value ? <Tag color="green">{value}</Tag> : <Tag>–</Tag>
          }
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
