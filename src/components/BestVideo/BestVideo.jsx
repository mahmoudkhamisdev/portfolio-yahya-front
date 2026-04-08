import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Player } from 'video-react'
import ButtonGlitch from '../../utils/ButtonGlitch/ButtonGlitch'
import Loader from '../../utils/Loader/Loader'
import YoutubeFrame from '../../utils/YoutubeFrame'
import './BestVideo.css'

const BestVideo = ({ allData, allWork, dataLoading }) => {

    return (
        <div className="main-bg1 rounded-5 justify-content-center">
            {/* <div className='d-inline-block p-0'><TitleCard name={'Latest_videos'} /></div> */}
            <Row className='mb-5'>
                <Col sm={12} className='video-container mb-4 p-0'>
                    {
                        allData.data && allData.data.length > 0 ? (
                            <>
                                {
                                    allData.data[0].mainVideo.startsWith('https://www.youtube.com/') ?
                                        <YoutubeFrame youtubeUrl={allData.data[0].mainVideo} />
                                        :
                                        < Player
                                            playsInline
                                            src={allData.data && allData.data[0].mainVideo}
                                            autoPlay
                                            muted
                                        />
                                }
                            </>
                        ) : <video autoPlay loop muted controls id="background-video" src={''} />
                    }
                </Col>
                <Col sm={12} className='d-flex justify-content-center flex-wrap gap-2 mb-4 px-2'>
                    {
                        dataLoading ?
                            allWork.data && allWork.data.length > 0 ?
                                (
                                    allWork.data.map((res) => {
                                        if (res.topVideo === true) {
                                            return (
                                                <Link to={`/work/${res._id}`}>
                                                    <div key={res._id} className='video-card rounded-4 text-center' style={{ width: '246px' }}>
                                                        <img src={res.imgCover} alt={res.name} />
                                                        <div className='video-content'>{res.name}</div>
                                                    </div>
                                                </Link>
                                            )
                                        } else {
                                            return (
                                                <div className='d-flex justify-content-center fs-3 fw-bold text-effect text-center'>{'There is no Top Work Videos Now !'}</div>
                                            )
                                        }
                                    })
                                ) :
                                <div className='d-flex justify-content-center fs-3 fw-bold text-effect text-center'>{'There is no Work Videos Now !'}</div>
                            :
                            <div className='d-flex justify-content-center'><Loader name={'Loading...'} /></div>
                    }
                </Col>
                <div className='text-center'>
                    <Link to={'/work'}><ButtonGlitch name={'Show More'} /></Link>
                </div>
            </Row>
        </div>

    )
}

export default BestVideo
