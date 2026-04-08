import React, { useCallback, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { EditData } from '../../../api/Axios/useEditData'
import { GetData } from '../../../api/Axios/useGetData'
import { PostDataImage } from '../../../api/Axios/usePostData'
import ButtonGlitch from '../../../utils/ButtonGlitch/ButtonGlitch'
import SdebarAdmin from '../../../utils/SidebarAdmin'
import UploadImg from '../../../utils/UploadImg/UploadImg'
import notify from '../../../utils/useToastify'
import YoutubeFrame from '../../../utils/YoutubeFrame'
import './AdminUpdateWork.css'

const AdminUpdateWork = () => {
    const workId = useParams('id')

    const [isTop, setIsTop] = useState(false);
    const [loading, setLoading] = useState(false);

    const [imgSelector, setImgSelector] = useState(null);
    const [videoSrc, setVideoSrc] = useState(null);

    const [name, setName] = useState("");
    const [shot, setShot] = useState("");
    const [edited, setEdited] = useState("");
    const [sound, setSound] = useState("");
    const [motion, setMotion] = useState("");
    const [script, setScript] = useState("");
    const [producer, setProducer] = useState("");
    const [produced, setProduced] = useState("");

    const handleUpdateWork = (e) => {
        e.preventDefault()
        setLoading(true)

        const formDataImg = new FormData();
        formDataImg.append('image', imgSelector);
        PostDataImage('https://api.imgbb.com/1/upload?key=4f4a682edac68442d7b34952d2d5b23c', formDataImg).then(res => {
            EditData(`/api/v1/work/${workId.id}`, {
                name,
                details: {
                    Shot: shot,
                    Edited: edited,
                    Sound: sound,
                    Motion: motion,
                    Script: script,
                    Producer: producer,
                    Produced: produced,
                },
                topVideo: isTop,
                workVideo: videoSrc,
                imgCover: res.data.data.display_url,
            }).then(res => {
                notify('Update Your Work Successfully', 'success')
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

    const getOneData = useCallback(() => {
        if (workId) {
            GetData(`/api/v1/work/${workId.id}`).then(res => {
                const myData = res.data.data
                if (myData) {
                    setName(myData.name)
                    setShot(myData.details.Shot)
                    setEdited(myData.details.Edited)
                    setSound(myData.details.Sound)
                    setMotion(myData.details.Motion)
                    setScript(myData.details.Script)
                    setProducer(myData.details.Producer)
                    setProduced(myData.details.Produced)
                    setIsTop(myData.topVideo)
                    setImgSelector(myData.imgCover)
                    setVideoSrc(myData.workVideo)
                }
            }).catch(err => {
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            });
        }
    }, [workId]);

    useEffect(() => {
        getOneData()
    }, [getOneData])

    return (
        <Row className='adminWork'>
            <SdebarAdmin />
            <Col sm={9} className='right'>
                <div className="form-container">
                    <form className="form" >
                        <Row>
                            <Col className="d-flex justify-content-center align-items-center">
                                <div className="form-group">
                                    <label for="imgProfile" className='fs-5'>Img Cover: </label>
                                    <UploadImg setImgSelector={setImgSelector} setVideoSrc={setVideoSrc} videoSrc={videoSrc} imgSelector={imgSelector} type={'img'} />
                                </div>
                            </Col>
                            {
                                videoSrc &&
                                <>
                                    <Col className="d-flex justify-content-center align-items-center">
                                        <div className="form-group w-100 h-100">
                                            <label for="imgProfile" className='fs-5'>Work Video: </label>
                                            <div style={{ width: '300px', height: '200px' }} className=''>
                                                <YoutubeFrame youtubeUrl={videoSrc} />
                                            </div>
                                        </div>
                                    </Col>
                                </>
                            }
                        </Row>
                        <div className="form-group">
                            <label for="workv">Work Video</label>
                            <input required="" value={videoSrc} placeholder='https://www.youtube.com/watch?v=ID' name="workv" id="workv" type="text" onChange={(e) => setVideoSrc(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label for="name">Your Name</label>
                            <input required="" name="name" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="fields-social">
                            <div className="namefield">Details</div>
                            <Row className='mb-2'>
                                <Col>
                                    <div className="form-group">
                                        <label for="Shot">Shot</label>
                                        <input required="" name="Shot" id="Shot" type="text" value={shot} onChange={(e) => setShot(e.target.value)} />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="form-group">
                                        <label for="Edited">Edited</label>
                                        <input required="" name="Edited" id="Edited" type="text" value={edited} onChange={(e) => setEdited(e.target.value)} />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col>
                                    <div className="form-group">
                                        <label for="Sound">Sound</label>
                                        <input required="" name="Sound" id="Sound" type="text" value={sound} onChange={(e) => setSound(e.target.value)} />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="form-group">
                                        <label for="Motion">Motion</label>
                                        <input required="" name="Motion" id="Motion" type="text" value={motion} onChange={(e) => setMotion(e.target.value)} />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="form-group">
                                        <label for="Script">Script</label>
                                        <input required="" name="Script" id="Script" type="text" value={script} onChange={(e) => setScript(e.target.value)} />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="form-group">
                                        <label for="Producer">Producer</label>
                                        <input required="" name="Producer" id="Producer" type="text" value={producer} onChange={(e) => setProducer(e.target.value)} />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="form-group">
                                        <label for="Produced">Produced</label>
                                        <input required="" name="Produced" id="Produced" type="text" value={produced} onChange={(e) => setProduced(e.target.value)} />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="form-group">
                            <div className="d-flex align-items-center gap-2">
                                <div className="checkbox-wrapper">
                                    <input type="checkbox" name='top' id='top' checked={isTop} onClick={(e) => setIsTop(!isTop)} />
                                    <svg viewBox="0 0 35.6 35.6">
                                        <circle r="17.8" cy="17.8" cx="17.8" className="background"></circle>
                                        <circle r="14.37" cy="17.8" cx="17.8" className="stroke"></circle>
                                        <polyline
                                            points="11.78 18.12 15.55 22.23 25.17 12.87"
                                            className="check"
                                        ></polyline>
                                    </svg>
                                </div>
                                <label for="top" className='m-0'>Is Top Video</label>
                            </div>
                        </div>
                        <div className="text-end">
                            <ButtonGlitch name={'Update'} loading={loading} handle={(e) => handleUpdateWork(e)} />
                        </div>
                    </form>
                </div>
            </Col>
        </Row >
    )
}

export default AdminUpdateWork
