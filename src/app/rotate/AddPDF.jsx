import React, { useState } from 'react'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import styles from './index.module.css'

const AddPDF = ({ onAddFile }) => {
  return (
    <div className={styles.addPDFContainer}>
      <label className={styles.addButton}>
        <UploadOutlined />
        <span>Add Another PDF</span>
        <input
          type="file"
          accept="application/pdf"
          onChange={onAddFile}
          className={styles.hiddenInput}
        />
      </label>
    </div>
  )
}

export default AddPDF
