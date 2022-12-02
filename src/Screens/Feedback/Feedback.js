import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { db } from "../../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { DataGrid } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Feedback = () => {
  let i = 1;
  const [ReviewName, setReviewName] = useState("")
  const [QuizID, setQuizID] = useState('')
  const [UserID, setUserID] = useState('')
  const [Feedback, setFeedback] = useState("")
  const [orderDetail, setOrderDetail] = useState([]);
  useEffect(() => {
    getOrderData();
  }, [])
  const getOrderData = async () => {
    let resultArray = [];
    const docRef = collection(db, "UserPerformance");
    try {
      const docSnap = await getDocs(docRef);
      docSnap.forEach((item) => {
        resultArray.push({ id: item.id, ...item.data() });
        console.log("hi");
      });
      console.log(resultArray);
      setOrderDetail(resultArray);

    } catch (error) {
      console.log(error)
    }
  }
  const SubmitFeedback = async () => {
    if (Feedback === "" || QuizID === "" || UserID === "" || ReviewName === "") {
      toast.warning('Please fill all the fields', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "light",
        type: "error"
      });
    }
    else {
      try {
        await addDoc(collection(db, "UserPerformance"), {
          AdminFeedback: Feedback,
          quizID: QuizID,
          UserID: UserID,
          ReviewerName: ReviewName
        }).then((docRef) => {
          console.log(docRef.id)
          toast.success('🦄 Your feedback has given to student', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            theme: "light",
          });
          getOrderData();
        }).catch((error) => {
          console.log(error.code)
          console.log(error.message)
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <>
      <Box display="flex"
        flexDirection={"row"}>
        <div style={{ marginLeft: "5%" }}>
          <form>
            <Box
              display="flex"
              flexDirection={"column"}
              maxWidth={400}
              alignItems={"center"}
              justifyContent={"center"}
              margin="auto"
              marginTop={5}
              padding={3}
              borderRadius={5}
              boxShadow={"5px 5px 10px #ccc"}
              sx={{
                ":hover": {
                  boxShadow: "10px 10px 20px 10px #ccc",
                },
              }}
            >
              <Typography variant="h5" padding={3} textAlign="center">Feedback Form</Typography>
              <TextField sx={{ width: 350 }} InputProps={{ sx: { height: 180 } }} margin="normal" type={'text'} variant="outlined" placeholder="Feedback" onChange={(event) => setFeedback(event.target.value)} />
              <TextField sx={{ width: 350 }} margin="normal" type={'text'} variant="outlined" placeholder="Reviewer Name" onChange={(event) => setReviewName(event.target.value)} />
              <TextField sx={{ width: 350 }} margin="normal" type={'text'} variant="outlined" placeholder="Quiz ID" onChange={(event) => setQuizID(event.target.value)} />
              <TextField sx={{ width: 350 }} margin="normal" type={'text'} variant="outlined" placeholder="UserID" onChange={(event) => setUserID(event.target.value)} />
              <Button
                sx={{ marginTop: 3, borderRadius: 3, width: 220 }}
                variant="contained"
                color="warning"
                onClick={SubmitFeedback}
              >Submit</Button>
            </Box>
          </form>
        </div>
        <div style={{ height: "500px", margin: "auto", width: "auto", marginTop: "30px", marginBottom: "10%", borderRadius: "35px", width: "60%" }}>
          <h1>Feedback on assignment</h1>
          <DataGrid
            rows={
              orderDetail.map((item, index) => (
                { sno: i++, id: item.id, Feedback: item.AdminFeedback, Name: item.ReviewerName, UserID: item.UserID }
              ))}
            columns={[
              { field: 'sno', headerName: 'sno', width: 40 },
              { field: 'id', headerName: 'ID', width: 210 },
              { field: 'Name', headerName: 'Name', width: 200 },
              { field: 'Feedback', headerName: 'Feedback', width: 300 },
              { field: 'UserID', headerName: 'UserID', width: 150 },
            ]}
            pageSize={9}
            rowsPerPageOptions={[8]}
            style={{ margin: "auto", borderRadius: "5px", BorderColor: "black", width: "100%", border: "2px solid black", padding: "10px" }}
          />
        </div>
      </Box>
      <ToastContainer />
    </>
  );
};
export default Feedback;