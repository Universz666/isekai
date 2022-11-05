import {
  Checkbox,
  Divider,
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
} from "antd";
import React, { useState, useContext, useEffect, useRef } from "react";
import { Box, Flex } from "reflexbox";
import styled from "@emotion/styled";
import Layouts from "../../../components/Layouts";

import useSWR from "swr";
import { update_role, delete_user } from "../../api";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

function Users() {
  const url = "http://localhost:8000/api/v1/getAllUser";
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error } = useSWR(url, fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const data_all = [];
  if (data) {
    for (let i = 0; i < data?.detail.length; i++) {
      data_all.push(data?.detail[i]);
    }
  }

  const defaultColumns = [
    {
      title: "User Name",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) =>
        data_all.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.id, record.role)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleDelete = async (key, role) => {
    const payLoad = {
      role: role,
      id: key,
    };
    try {
      await delete_user(payLoad).then((response) => {
        if (response.status == 200) {
          console.log("respone ===>", response);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSave = async (row) => {
    const newData = [...data_all];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });

    const payLoad = {
      id: row.id,
      role: row.role,
    };
    console.log(payLoad);

    try {
      await update_role(payLoad).then((response) => {
        if (response.status == 200) {
          console.log("response ===>", response);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <Layouts>
      <div>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={data_all}
          columns={columns}
        />
      </div>
    </Layouts>
  );
}

export default Users;
