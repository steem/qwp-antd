import React from 'react'
import styles from './index.less'

class PortalPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.imageContainer}>
        <div className="image1 image-wrapper" style={{transform: "matrix(1, 0, 0, 1, 0, 0)", opacity: 1}} ></div>
        <div className="text-wrapper">
          <h2 style={{opacity: 1, visibility: 'visible', transform: "translateX(0)"}}><span>Best Practice</span></h2>
          <p style={{maxWidth: 310, opacity: 1, visibility: 'visible', transform: "translateX(0)"}} className="">
            <span>Designed by experienced team, and showcase dozens of inspiring projects.</span>
          </p>
          <div className="" style={{opacity: 1, visibility: 'visible', transform: "translateX(0)"}}>
            <button type="button " className="ant-btn ant-btn-primary ant-btn-lg "><span>Learn more</span><i type="right " className="anticon anticon-right "></i></button>
          </div>
        </div>
      </div>
    )
  }
}

export default PortalPage
