import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import SdebarAdmin from '../../../utils/SidebarAdmin'
import notify from '../../../utils/useToastify'
import ButtonGlitch from '../../../utils/ButtonGlitch/ButtonGlitch'
import { PostData } from '../../../api/Axios/usePostData'
import YoutubeFrame from '../../../utils/YoutubeFrame'
// import './AdminAddReels.css'

const AdminAddReels = () => {
    const [loading, setLoading] = useState(false);

    const [videoSrc, setVideoSrc] = useState(null);

    const [name, setName] = useState("");
    const [likes, setLikes] = useState(0);

    const handleAddReels = (e) => {
        e.preventDefault()
        setLoading(true)

        PostData(`/api/v1/reels`, {
            name,
            likes,
            reelsVideo: videoSrc
        }).then(res => {
            notify('Add Your Reels Successfully', 'success')
            setLoading(false)
        }).catch(err => {
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            setLoading(false)
        });
    }

    return (
        <Row className='adminReels'>
            <SdebarAdmin />
            <Col sm={9} className='right'>
                <div className="form-container">
                    <form className="form" >
                        <div className="d-flex justify-content-center align-items-center">
                            {
                                videoSrc &&
                                <>
                                    <div className="form-group w-100 h-100">
                                        <label for="reel" className='fs-5'>Reels Video: </label>
                                        <div>
                                            <YoutubeFrame youtubeUrl={videoSrc} />
                                        </div>
                                    </div>
                                </>
                            }
                        </div>

                        <div className="form-group">
                            <label for="reelv">Reel Video</label>
                            <input required="" placeholder='https://www.youtube.com/shorts/ID' name="reelv" id="reelv" type="text" onChange={(e) => setVideoSrc(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label for="name">Reel Name</label>
                            <input required="" name="name" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label for="likes">Reel Likes</label>
                            <input required="" name="likes" id="likes" type="number" value={likes} onChange={(e) => setLikes(e.target.value)} />
                        </div>
                        <div className="text-end">
                            <ButtonGlitch name={'Add'} loading={loading} handle={(e) => handleAddReels(e)} />
                        </div>
                    </form>
                </div>
            </Col>
        </Row >
    )
}

export default AdminAddReels
