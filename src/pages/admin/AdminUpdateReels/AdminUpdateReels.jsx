import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import SdebarAdmin from '../../../utils/SidebarAdmin'
import notify from '../../../utils/useToastify'
import { useParams } from 'react-router-dom'
import { GetData } from '../../../api/Axios/useGetData'
import ButtonGlitch from '../../../utils/ButtonGlitch/ButtonGlitch'
import { EditDataImage } from '../../../api/Axios/useEditData'
import { DateFormate } from '../../../utils/DateFormate'
import './AdminUpdateReels.css'
import Loader from '../../../utils/Loader/Loader'
import { DeleteData } from '../../../api/Axios/useDeleteData'
import YoutubeFrame from '../../../utils/YoutubeFrame'

const AdminUpdateReels = () => {
    const reelsId = useParams('id')

    const [loading, setLoading] = useState(false);

    const [videoSrc, setVideoSrc] = useState(null);

    const [name, setName] = useState("");
    const [likes, setLikes] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [updatedAt, setUpdatedAt] = useState("");
    const [allComments, setAllComments] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(false);

    const handleUpdateReels = (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData();
        formData.append("name", name);
        formData.append("likes", likes);
        formData.append("reelsVideo", videoSrc);

        EditDataImage(`/api/v1/reels/${reelsId.id}`, formData).then(res => {
            notify('Update Your Reels Successfully', 'success')
            setLoading(false)
        }).catch(err => {
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            setLoading(false)
        });
    }

    const getOneData = useCallback(() => {
        if (reelsId) {
            GetData(`/api/v1/reels/${reelsId.id}`).then(res => {
                const myData = res.data.data
                if (myData) {
                    setName(myData.name)
                    setLikes(myData.likes)
                    setVideoSrc(myData.reelsVideo)
                    setCreatedAt(myData.createdAt)
                    setUpdatedAt(myData.updatedAt)
                }
            }).catch(err => {
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            });
        }
    }, [reelsId]);

    const getAllComments = useCallback(async (e) => {
        if (reelsId.id) {
            try {
                const res = await GetData(`/api/v1/reels/${reelsId.id}/comments`);
                setAllComments(res.data);
                setIsDataLoading(true)
            } catch (err) {
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error');
            }
        }
    }, [reelsId.id]);

    useEffect(() => {
        getOneData()
        getAllComments()
    }, [getOneData, getAllComments])

    const handleDeleteComment = (e, id) => {
        e.preventDefault()
        DeleteData(`/api/v1/reelsComments/${id}`).then(res => {
            notify('Delete Comment Successfully', 'success')
            getAllComments()
        }).catch(err => {
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
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
                            <input required="" value={videoSrc} placeholder='https://www.youtube.com/shorts/ID' name="reelv" id="reelv" type="text" onChange={(e) => setVideoSrc(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label for="name">Your Name</label>
                            <input required="" name="name" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label for="likes">Video Likes</label>
                            <input required="" name="likes" id="likes" type="number" value={likes} onChange={(e) => setLikes(e.target.value)} />
                        </div>
                        <Row>
                            <Col sm={6}>
                                <div className="form-group">
                                    <div className="d-flex align-items-center gap-2">
                                        <label for="create" className='m-0 fs-6'>Created At:</label>
                                        <p>{DateFormate(createdAt)}</p>
                                    </div>
                                </div>

                            </Col>
                            <Col sm={6}>
                                <div className="form-group">
                                    <div className="d-flex align-items-center gap-2">
                                        <label for="create" className='m-0 fs-6'>Updated At:</label>
                                        <p>{DateFormate(updatedAt)}</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="text-end">
                            <ButtonGlitch name={'Update'} loading={loading} handle={(e) => handleUpdateReels(e)} />
                        </div>
                    </form>


                    <div className="form-group">
                        <label for="comment" className='fs-5'>Reels Comments: </label>
                    </div>
                    <div className="comment-card mt-3">
                        {
                            isDataLoading ?
                                allComments.data && allComments.data.length > 0 && allComments.data.length !== 0 ?
                                    (
                                        allComments.data.map((res) => {
                                            return (
                                                <div className="comments second-bg m-2 rounded-5">
                                                    <div className="comment-container">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div className="user">
                                                                <div className="user-pic">
                                                                    <svg fill="none" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                                                                        <path stroke-linejoin="round" fill="#707277" stroke-linecap="round" stroke-width="2" stroke="#707277" d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"></path>
                                                                        <path stroke-width="2" fill="#707277" stroke="#707277" d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"></path>
                                                                    </svg>
                                                                </div>
                                                                <div className="user-info">
                                                                    <span>{res.name}</span>
                                                                    <p>{DateFormate(res.createdAt)}</p>
                                                                </div>
                                                            </div>
                                                            <Button variant='danger' onClick={(e) => handleDeleteComment(e, res._id)}>Delete</Button>
                                                        </div>
                                                        <p className="comment-content">
                                                            {res.comment}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) :
                                    <div className='d-flex justify-content-center fs-5 fw-bold text-effect text-center m-2'>{'There is no Comments for this reel :('}</div>
                                :
                                <div className='d-flex justify-content-center'><Loader name={'Loading...'} /></div>
                        }
                    </div>
                </div>
            </Col>
        </Row >
    )
}

export default AdminUpdateReels
