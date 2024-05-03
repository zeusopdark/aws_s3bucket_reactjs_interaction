import { useState } from 'react'
import axios from 'axios'
import './App.css'

async function postImage({ image, description }) {
  const formData = new FormData();
  formData.append("image", image)
  formData.append("description", description)

  const result = await axios.post('http://localhost:8000/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return result.data
}


function App() {

  const [file, setFile] = useState()
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])

  const submit = async event => {
    event.preventDefault()
    const result = await postImage({ image: file, description });

    if (result.success) {
      try {
        const response = await axios.put(result.data, file, { headers: { "Content-Type": file.type } })

        if (response.status === 200) {
          try {
            const response = await axios.get(`http://localhost:8000/getImage/${result.imaged._id}`, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (response.data.success) {
              setImages([...images, response.data.data]);
            }
          } catch (err) {
            console.log("An error occured", err);
          }
        }
        else {
          console.error("Failed to upload File:", response.statusText);
        }
      } catch (err) {
        console.error("Error uploading file:", err)
      }
    }
  }

  console.log(images);
  const fileSelected = event => {
    const file = event.target.files[0]
    setFile(file)
  }

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input value={description} onChange={e => setDescription(e.target.value)} type="text"></input>
        <button type="submit">Submit</button>
      </form>

      {images.map((image, index) => (
        <div key={index}>
          <img src={image}></img>
        </div>
      ))}
    </div>
  );
}

export default App;
