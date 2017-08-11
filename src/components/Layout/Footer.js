import React from 'react'
import styles from './Footer.less'
import { l } from 'utils/localization'

const Footer = () => <div className={styles.footer} id="footer">
  {l('footerText')}
</div>

export default Footer
