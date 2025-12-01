import { List, useTable, EditButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Image, Typography, Tag } from "antd";

export const AchievementList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    sorters: { initial: [{ field: "id", order: "desc" }] },
  });

  return (
    <List title={<Typography.Title level={3}>Achievements</Typography.Title>}>
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{ ...tableProps.pagination, pageSize: 10 }}
      >

        <Table.Column
          title="Image"
          dataIndex="image"
          width={100}
          render={(value) => (
            <Image
              width={60}
              height={60}
              src={value}
              style={{ objectFit: "contain" }}
              fallback="https://placehold.co/60x60?text=No+Img"
            />
          )}
        />

        <Table.Column
          title="Title"
          dataIndex="title"
          render={(value) => <Typography.Text strong>{value}</Typography.Text>}
        />

        <Table.Column title="Issuer" dataIndex="issuer" />

        <Table.Column
          title="Year"
          dataIndex="year"
          render={(value) => <Tag color="blue">{value}</Tag>}
        />

        <Table.Column
          title="Credential URL"
          dataIndex="credential_url"
          render={(value) =>
            value ? (
              <a href={value} target="_blank" rel="noopener noreferrer">
                View Credential
              </a>
            ) : (
              <Typography.Text type="secondary">–</Typography.Text>
            )
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
