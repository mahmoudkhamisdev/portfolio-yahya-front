import React, { useCallback, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import UploadImg from '../../../utils/UploadImg/UploadImg'
import ButtonGlitch from '../../../utils/ButtonGlitch/ButtonGlitch'
import SdebarAdmin from '../../../utils/SidebarAdmin'
import './AdminHome.css'
import { PostData, PostDataImage } from '../../../api/Axios/usePostData'
import notify from '../../../utils/useToastify'
import { GetData } from '../../../api/Axios/useGetData'
import { DeleteData } from '../../../api/Axios/useDeleteData'
import { EditData } from '../../../api/Axios/useEditData'
import YoutubeFrame from '../../../utils/YoutubeFrame'

const AdminHome = () => {
    const dataId = localStorage.getItem('dataId')

    const [loading, setLoading] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [oneData, setOneData] = useState(null);

    const [imgSelector, setImgSelector] = useState(null);
    const [videoSrc, setVideoSrc] = useState(null);

    const [name, setName] = useState("");
    const [nameProfile, setNameProfile] = useState("");
    const [career, setCareer] = useState("");
    const [email, setEmail] = useState("");
    const [linkFacebook, setLinkFacebook] = useState("");
    const [linkInstargram, setLinkInstargram] = useState("");
    const [linkBehance, setLinkBehance] = useState("");
    const [linkYoutube, setLinkYoutube] = useState("");

    const handleAddData = (e) => {
        e.preventDefault()
        setLoading(true)

        const formDataImg = new FormData();
        formDataImg.append('image', imgSelector && imgSelector);

        PostDataImage('https://api.imgbb.com/1/upload?key=4f4a682edac68442d7b34952d2d5b23c', formDataImg).then(res => {
            PostData('/api/v1/userInfo', {
                name,
                nameProfile,
                career,
                email,
                socailMedia: {
                    linkFacebook,
                    linkInstargram,
                    linkBehance,
                    linkYoutube
                },
                mainVideo: videoSrc,
                imgProfile: res.data.data.display_url,
            }).then(res => {
                notify('Add Your Data Successfully', 'success')
                localStorage.setItem('dataId', res.data.data._id)
                setLoading(false)
                setIsAdd(true)
            }).catch(err => {
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
                setLoading(false)
            });

        }).catch(err => {
            notify(err, 'error')
            setLoading(false)
        });


    }

    const handleUpdateData = (e) => {
        e.preventDefault()
        setLoading(true)

        const formDataImg = new FormData();
        formDataImg.append('image', imgSelector);
        PostDataImage('https://api.imgbb.com/1/upload?key=4f4a682edac68442d7b34952d2d5b23c', formDataImg).then(res => {
            EditData(`/api/v1/userInfo/${dataId}`, {
                name,
                nameProfile,
                career,
                email,
                socailMedia: {
                    linkFacebook,
                    linkInstargram,
                    linkBehance,
                    linkYoutube
                },
                mainVideo: videoSrc,
                imgProfile: res.data.data.display_url,
            }).then(res => {
                notify('Update Your Data Successfully', 'success')
                localStorage.setItem('dataId', res.data.data._id)
                setLoading(false)
            }).catch(err => {
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
                setLoading(false)
            });
        }).catch(err => {
            notify(err, 'error')
            setLoading(false)
        });
    }

    const handleDeleteData = (e) => {
        if (dataId) {
            e.preventDefault()
            DeleteData(`/api/v1/userInfo/${dataId}`).then(res => {
                notify('Delete Your Data Successfully', 'success')
                localStorage.removeItem('dataId')
                setVideoSrc('')
                setName('')
                setNameProfile('')
                setCareer('')
                setEmail('')
                setLinkFacebook('')
                setLinkInstargram('')
                setLinkBehance('')
                setLinkYoutube('')
                setIsAdd(false)
                setOneData(null)
            }).catch(err => {
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            });
        }
    }

    const getOneData = useCallback(() => {
        if (dataId) {
            GetData(`/api/v1/userInfo/${dataId}`).then(res => {
                const myData = res.data.data
                setOneData(myData)
                if (res.data.data) {
                    setName(myData.name)
                    setNameProfile(myData.nameProfile)
                    setCareer(myData.career)
                    setEmail(myData.email)
                    setLinkFacebook(myData.socailMedia.linkFacebook)
                    setLinkInstargram(myData.socailMedia.linkInstargram)
                    setLinkBehance(myData.socailMedia.linkBehance)
                    setLinkYoutube(myData.socailMedia.linkYoutube)
                    setImgSelector(myData.imgProfile)
                    setVideoSrc(myData.mainVideo)
                }
            }).catch(err => {
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            });
        }
    }, [dataId]);

    useEffect(() => {
        getOneData()
    }, [getOneData])


    return (
        <Row className='adminHome'>
            <SdebarAdmin />
            <Col sm={9} className='right'>
                <div className="form-container">
                    <form className="form">
                        <Row>
                            <Col className="d-flex justify-content-center align-items-center">
                                <div className="form-group">
                                    <label for="imgProfile" className='fs-5'>Your Img Profile: </label>
                                    <UploadImg setImgSelector={setImgSelector} setVideoSrc={setVideoSrc} videoSrc={videoSrc} imgSelector={imgSelector} type={'img'} />
                                </div>
                            </Col>
                            {
                                videoSrc &&
                                <>
                                    <Col className="d-flex justify-content-center align-items-center m-auto">
                                        <div className="form-group w-100 h-100 justify-content-center align-items-center">
                                            <label for="imgProfile" className='fs-5'>Your Home Video: </label>
                                            <div style={{ width: '300px', height: '200px' }} className=''>
                                                <YoutubeFrame youtubeUrl={videoSrc} />
                                            </div>
                                        </div>
                                    </Col>
                                </>
                            }

                        </Row>
                        <div className="form-group">
                            <label for="real">Your Home Video</label>
                            <input value={videoSrc} required="" placeholder='https://www.youtube.com/watch?v=ID' name="real" id="real" type="text" onChange={(e) => setVideoSrc(e.target.value)} />
                        </div>
                        <Row>
                            <Col>
                                <div className="form-group">
                                    <label for="name">Your Name</label>
                                    <input value={name} required="" name="name" id="name" type="text" onChange={(e) => setName(e.target.value)} />
                                </div>
                            </Col>
                            <Col>
                                <div className="form-group">
                                    <label for="career">Your Career</label>
                                    <input value={career} required="" name="career" id="career" type="text" onChange={(e) => setCareer(e.target.value)} />
                                </div>

                            </Col>
                        </Row>
                        <div className="form-group">
                            <label for="real">Your Real Name</label>
                            <input value={nameProfile} required="" name="real" id="real" type="text" onChange={(e) => setNameProfile(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label for="email">Your Email</label>
                            <input value={email} required="" name="email" id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="fields-social">
                            <div className="namefield">Socail Media</div>
                            <Row className='mb-2'>
                                <Col>
                                    <div className="form-group">
                                        <label for="linkFacebook">Your Link Facebook</label>
                                        <input value={linkFacebook} required="" name="linkFacebook" id="linkFacebook" type="text" onChange={(e) => setLinkFacebook(e.target.value)} />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="form-group">
                                        <label for="linkInstargram">Your Link Instargram</label>
                                        <input value={linkInstargram} required="" name="linkInstargram" id="linkInstargram" type="text" onChange={(e) => setLinkInstargram(e.target.value)} />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="form-group">
                                        <label for="linkBehance">Your LinkBehance</label>
                                        <input value={linkBehance} required="" name="name" id="name" type="text" onChange={(e) => setLinkBehance(e.target.value)} />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="form-group">
                                        <label for="linkYoutube">Your Link Youtube</label>
                                        <input value={linkYoutube} required="" name="name" id="name" type="text" onChange={(e) => setLinkYoutube(e.target.value)} />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="d-flex justify-content-between">
                            {
                                isAdd || oneData !== null ?
                                    <ButtonGlitch loading={loading} handle={(e) => handleDeleteData(e)} name={'Delete'} />
                                    :
                                    <div></div>
                            }
                            {
                                isAdd || oneData !== null ?
                                    <ButtonGlitch loading={loading} handle={(e) => handleUpdateData(e)} name={'Update'} />
                                    :
                                    <ButtonGlitch loading={loading} handle={(e) => handleAddData(e)} name={'Add'} />
                            }
                        </div>
                    </form>
                </div>
            </Col>
        </Row>
    )
}

export default AdminHome
