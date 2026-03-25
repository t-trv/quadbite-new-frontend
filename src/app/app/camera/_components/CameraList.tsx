'use client';

import Table from '@/components/table/Table';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function CameraList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cameras'],
    queryFn: () =>
      axios
        .get('http://42.96.5.149:8080/HM3BAOYNdLXEvFgSp8tnrNQmXf4oPq/monitor/linhtinhgmailcom')
        .then((res) => res.data),
  });

  const columnConfig = [
    {
      key: 'name',
      label: 'Tên camera',
      width: '10%',
    },
    {
      key: 'ke',
      label: 'Key',
      width: '10%',
    },
    {
      key: 'url',
      label: 'URL',
      width: '200px',
    },
    {
      key: 'host',
      label: 'Host',
      width: '200px',
    },
    {
      key: 'status',
      label: 'Trạng thái',
      width: '200px',
    },
  ];

  return (
    <div className="mt-4">
      <Table columns={columnConfig} data={data} />
    </div>
  );
}
