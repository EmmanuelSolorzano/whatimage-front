import React, { Component } from 'react'
import Dropzone from 'react-dropzone';
import { Alert, Button, Spinner, Image } from 'react-bootstrap';
import './Classifier.css'
import axios from 'axios';

class Classifier extends Component {
    state = { 
        files: [],
        isLoading: false,
        recentImage: null,
     }

    onDrop = (files) => {
        this.setState({isLoading:true,files:[],recentImage:null})
        this.loadImage(files)
     }

    loadImage = (files) => {
        setTimeout(()=> {
            this.setState({files,isLoading:false}, () => console.log(this.state.files[0].name))
        }, 1000)
     }

     sendImage = () => {
        this.activateSpinner()
        let formData = new FormData()
        formData.append('picture', this.state.files[0], this.state.files[0].name)
        axios.post('http://127.0.0.1:8000/api/images/', formData, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }).then(resp=>{this.getImageClass(resp) })
        .catch(err=>{console.log('Error message here '+err)})
     }

     getImageClass = (obj) => {
        axios.get(`http://127.0.0.1:8000/api/images/${obj.data.id}/`, {
            headers: {
                'accept': 'application/json',
            }
        }).then(resp=>{this.setState({recentImage:resp})
            console.log(resp)})
        .catch(err=>{console.log(err)})
        this.deactivateSpinner()
     }

     activateSpinner = () => {
        this.setState({isLoading:true, files:[]})
     }

     deactivateSpinner = () => {
        this.setState({isLoading:false})
     }

    

    render() { 
        const files = this.state.files.map(file => (
            <li key={file.name}>
              {file.name} - {file.size} bytes
            </li>
          ));
        return (
            <Dropzone onDrop={this.onDrop} accept='image/png, image/jpeg'>
                {({isDragActive, getRootProps, getInputProps}) => (
                <section className="container">
                    <div {...getRootProps({className: 'dropzone back'})}>
                    <input {...getInputProps()} />
                    <p>{isDragActive ? "Drop some images" : "Drag 'n' drop some files here, or click to select files"}</p>
                    </div>
                    <aside>
                    <ul>{files}</ul>
                    </aside>

                    {this.state.files.length > 0 &&
                        <Button variant='info' size='lg' onClick={this.sendImage}>Select Images</Button>
                    }
                    
                    {this.state.isLoading &&
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    }

                    {this.state.recentImage &&
                    <React.Fragment>
                        <Alert variant='primary'>
                            {this.state.recentImage.data.classified}
                        </Alert>
                        <Image className='justify-content-center' src={this.state.recentImage.data.picture} height='200' rounded/>
                    </React.Fragment>
                    }
                </section>
                )}
            </Dropzone> 
        );
    }
}
 
export default Classifier;