import { List, useTable, EditButton, DeleteButton, DateField } from "@refinedev/antd";
import { Table, Space, Image, Tag, Typography } from "antd";

const { Paragraph } = Typography;

export const ExperienceList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    sorters: { initial: [{ field: "start_date", order: "desc" }] }
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        
        <Table.Column 
            dataIndex="logo" 
            title="Logo" 
            width={70}
            render={(val) => (
                <Image 
                    width={40} 
                    height={40}
                    src={val ? val : "error"} 
                    fallback="https://placehold.co/40?text=Logo"
                    style={{ objectFit: 'contain', borderRadius: '8px', border: '1px solid #f0f0f0' }}
                />
            )}
        />

        <Table.Column 
            dataIndex="company" 
            title="Company" 
            render={(val, record: any) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{val}</span>
                    {record.location && (
                        <span style={{ fontSize: '11px', color: '#888' }}>📍 {record.location}</span>
                    )}
                </div>
            )} 
        />

        <Table.Column dataIndex="role" title="Role" />

        <Table.Column 
            dataIndex="technologies" 
            title="Tech Stack"
            width={200}
            render={(tags) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {Array.isArray(tags) && tags.map((tag: string) => (
                        <Tag key={tag} color="blue" style={{ fontSize: '10px', margin: 0 }}>
                            {tag}
                        </Tag>
                    ))}
                </div>
            )}
        />
        
        <Table.Column 
            dataIndex="start_date" 
            title="Start" 
            width={100}
            render={(val) => <DateField value={val} format="MMM YYYY" />}
        />
        
        <Table.Column 
            title="End" 
            width={100}
            render={(_, record: any) => (
                (record.is_current === 1 || record.is_current === true)
                ? <Tag color="green">Present</Tag> 
                : <DateField value={record.end_date} format="MMM YYYY" />
            )}
        />

        <Table.Column 
            dataIndex="description" 
            title="Description" 
            width={250}
            render={(val) => (
                <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }} style={{ marginBottom: 0, fontSize: '12px' }}>
                    {val}
                </Paragraph>
            )}
        />

        <Table.Column
          title="Actions"
          fixed="right"
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