import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";

const MyBookings = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [orderId, setOrderId] = useState("");
  const [control, setControl] = useState(false);

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    fetch("http://localhost:8000/myOrder/${user?.email}")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, [user?.email, control]);
  const handleOrderId = (id) => {
    setOrderId(id);
    console.log(id);
  };

  const onSubmit = (data) => {
    console.log(data, orderId);
    fetch("http://localhost:8000/statusUpdate/${orderId}", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => console.log(result));
  };
  const handleDelete = (id) => {
    fetch("http://localhost:8000/deleteOrder/${id}", {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount) {
          setControl(!control);
        }
      });
    console.log(id);
  };

  return (
    <>
      <div>
        <h1>MyBookings {orders.length}</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Service Title</th>
              <th>Event description</th>
              <th>Image Link</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          {orders?.map((pd, index) => (
            <tbody>
              <tr>
                <td>{index}</td>
                <td>{pd.name}</td>
                <td>{pd.description}</td>
                <td>{pd.image}</td>
                <td>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <select
                      onClick={() => handleOrderId(pd?._id)}
                      {...register("status")}
                    >
                      <option value={pd?.status}>{pd?.status}</option>
                      <option value="approve">approve</option>
                      <option value="done">Done</option>
                    </select>
                    <input type="submit" />
                  </form>
                </td>
                <button
                  onClick={() => handleDelete(pd?._id)}
                  className="btn bg-danger p-2"
                >
                  Delete
                </button>
                <button
                  onSubmit={handleSubmit(onSubmit)}
                  className="btn bg-success p-2"
                >
                  Update
                </button>
              </tr>
            </tbody>
          ))}
        </Table>
      </div>
    </>
  );
};

export default MyBookings;
