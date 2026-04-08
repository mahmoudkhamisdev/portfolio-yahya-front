import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { BiCommentDetail } from "react-icons/bi"
import { useParams } from 'react-router-dom'
import { GetData } from '../../api/Axios/useGetData'
import { PostData } from '../../api/Axios/usePostData'
import { DateFormate } from '../../utils/DateFormate'
import { getEmbedUrl } from '../../utils/GetEmbedUrl'
import Loader from '../../utils/Loader/Loader'
import notify from '../../utils/useToastify'
import './ReelsDetails.css'

const ReelsDetails = () => {
    const reelsId = useParams('id')

    // Model To Comment
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [reelsDetails, setReelsDetails] = useState([]);
    const [allComments, setAllComments] = useState([]);
    const [isLike, setIsLike] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [myComment, setmyComment] = useState('');

    const getOneData = useCallback(async () => {
        if (reelsId.id) {
            try {
                const res = await GetData(`/api/v1/reels/${reelsId.id}`);
                setReelsDetails(res.data);
                setIsDataLoading(true)
            } catch (err) {
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error');
                setIsDataLoading(false)
            }
        }
    }, [reelsId.id]);

    const handleAddLike = (e) => {
        setIsLike(!isLike)
        PostData(`/api/v1/reels/like/${reelsId.id}`).then(res => {
            notify(res.data.msg, 'success')
            getOneData()
        }).catch(err => {
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            setIsLike(false)
        });
    }

    const getAllComments = useCallback(async (e) => {
        if (reelsId.id) {
            try {
                const res = await GetData(`/api/v1/reels/${reelsId.id}/comments`);
                setAllComments(res.data);
                // setIsDataLoading(true)
            } catch (err) {
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error');
            }
        }
    }, [reelsId.id]);

    useEffect(() => {
        const fetchData = async () => {
            await getOneData();  // Wait for data to be fetched
            await getAllComments()
        };
        fetchData();
        if (isDataLoading) {
            GetData(`/api/v1/reels/allLikes`).then(async res => {
                let identifiers = []
                res.data.data.map((data) => identifiers.push(data.identifier))

                // Get My Ip
                axios.get('https://api.ipify.org?format=json').then((myIp) => {
                    // Get Index Of Likes Data => To Check If IdVideo === id Of reelVideo
                    var likesIndex = res.data.data.findIndex((element) => {
                        return element.videoId === reelsDetails.data?._id
                    })

                    if (likesIndex !== -1 &&
                        res.data.data[likesIndex] &&
                        res.data.data[likesIndex].videoId === reelsDetails.data?._id &&
                        identifiers.includes(myIp.data.ip)) {
                        setIsLike(true)
                    } else {
                        setIsLike(false)
                    }
                });

            }).catch(err => {
                console.log(err)
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg || err.message, 'error')
            });
        }

    }, [reelsDetails.data?._id, isDataLoading, getOneData, getAllComments])

    const handleAddComment = (e) => {
        e.preventDefault()
        PostData(`api/v1/reels/${reelsId.id}/comments`, {
            comment: myComment
        }).then(res => {
            notify('Comment Added Successfully', 'success')
            getAllComments()
            getOneData()
        }).catch(err => {
            notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            setIsLike(false)
        });
    }

    return (
        <div className='main-bg1 reelsDetails'>
            <Row className='justify-content-center'>
                <Col sm={4}>
                </Col>
                <Col sm={4} className='video-reels'>
                    {/* <video width={'100%'} height={'100%'} className='rounded-4' src={`${reelsDetails.data?.reelsVideo}`} muted autoPlay controls /> */}
                    <iframe
                        loading="lazy"
                        width="100%"
                        height="100%"
                        src={getEmbedUrl(reelsDetails.data?.reelsVideo)}
                        title={reelsDetails.data?.name}
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                    />
                </Col>
                <Col sm={4} className='activityReels d-flex align-items-start flex-column justify-content-end gap-4'>
                    <div className='like'>
                        <label className="container d-flex flex-column align-items-center">
                            <input type="checkbox" checked={isLike} onClick={(e) => handleAddLike(e)} />
                            <div className="checkmark">
                                <svg viewBox="0 0 256 256">
                                    <rect fill="none" height="256" width="256"></rect>
                                    <path d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z" stroke-width="20px" stroke="#FFF" fill="none"></path></svg>
                            </div>
                            <p className='fs-6'>{reelsDetails.data?.likes}</p>
                        </label>
                    </div>
                    <div className="comment d-flex flex-column align-items-center" onClick={handleShow}>
                        <BiCommentDetail size={35} />
                        <p className='fs-6'>{allComments.results}</p>
                    </div>
                </Col>
            </Row>
            {/* Model To Comment */}
            <Modal show={show} onHide={handleClose} data-bs-theme="dark">
                <div className="comment-card">
                    <span className="title">Comments: {reelsDetails.data?.name}</span>
                    {
                        isDataLoading ?
                            allComments.data && allComments.data.length > 0 && allComments.data.length !== 0 ?
                                (
                                    allComments.data.map((res) => {
                                        return (
                                            <div className="comments second-bg m-2 rounded-5">
                                                <div className="comment-container">
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
                                                    <p className="comment-content">
                                                        {res.comment}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) :
                                <div className='d-flex justify-content-center fs-5 fw-bold text-effect text-center m-3'>{'There is no Comments for this reel :('}</div>
                            :
                            <div className='d-flex justify-content-center'><Loader name={'Loading...'} /></div>
                    }

                    <div className="text-box">
                        <div className="box-container d-flex gap-2">
                            <textarea placeholder="Reply" onChange={(e) => setmyComment(e.target.value)}></textarea>
                            <div>
                                <div className="formatting mt-1">
                                    <button type="submit" className="send" title="Send" onClick={(e) => { handleAddComment(e) }}>
                                        <svg fill="none" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" stroke="#ffffff" d="M12 5L12 20"></path>
                                            <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" stroke="#ffffff" d="M7 9L11.2929 4.70711C11.6262 4.37377 11.7929 4.20711 12 4.20711C12.2071 4.20711 12.3738 4.37377 12.7071 4.70711L17 9"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* Model To Comment */}
        </div>
    )
}

export default ReelsDetails