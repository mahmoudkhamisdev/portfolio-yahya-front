import React, { useCallback, useEffect, useState } from 'react'
import TitleCard from '../TitleCard/TitleCard'
import { Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { GetData } from '../../api/Axios/useGetData'
import notify from '../../utils/useToastify'
import { Player } from 'video-react'
import YoutubeFrame from '../../utils/YoutubeFrame'

const VideoDetails = () => {
    const workId = useParams('id')
    const [workDetails, setworkDetails] = useState([]);

    const getOneData = useCallback(() => {
        if (workId) {
            GetData(`/api/v1/work/${workId.id}`).then(res => {
                setworkDetails(res.data)
            }).catch(err => {
                notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
            });
        }
    }, [workId]);

    useEffect(() => {
        getOneData()
    }, [getOneData])

    return (
        <div className='main-bg1 rounded-5 '>
            <TitleCard name={`${workDetails.data?.name} `} />
            <Row>
                <Col sm={12} className='video-container mb-4 p-0 m-0'>
                    {
                        workDetails.data?.workVideo.startsWith('https://www.youtube.com/') ?
                            <YoutubeFrame youtubeUrl={workDetails.data?.workVideo} />
                            :
                            < Player
                                playsInline
                                src={workDetails.data?.workVideo}
                                autoPlay
                            />
                    }
                </Col>
                <Col sm={12} className='second-bg rounded-5 p-4 d-flex flex-column gap-3 fs-5'>
                    <h1 className='text-contact'>Details:</h1>
                    {
                        workDetails.data?.details.Shot !== '' && <p><b>Shot: </b>{workDetails.data?.details.Shot}</p>
                    }
                    {
                        workDetails.data?.details.Edited !== '' && <p><b>Edited: </b>{workDetails.data?.details.Edited}</p>
                    }
                    {
                        workDetails.data?.details.Sound !== '' && <p><b>Sound: </b>{workDetails.data?.details.Sound}</p>
                    }
                    {
                        workDetails.data?.details.Motion !== '' && <p><b>Motion: </b>{workDetails.data?.details.Motion}</p>
                    }
                    {
                        workDetails.data?.details.Script !== '' && <p><b>Script: </b>{workDetails.data?.details.Script}</p>
                    }
                    {
                        workDetails.data?.details.Producer !== '' && <p><b>Producer: </b>{workDetails.data?.details.Producer}</p>
                    }
                    {
                        workDetails.data?.details.Produced !== '' && <p><b>Produced: </b>{workDetails.data?.details.Produced}</p>
                    }

                </Col>
            </Row>
        </div>
    )
}

export default VideoDetails