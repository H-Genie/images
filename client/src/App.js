import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadForm from './Components/UploadForm';
import ImageList from './Components/ImageList';

const App = () => {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: "auto"
      }}
    >
      <ToastContainer />
      <h2>사진첩</h2>
      <UploadForm />
      <ImageList />
    </div>
  );
}

export default App;