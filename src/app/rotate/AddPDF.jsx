import React, { useRef } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import styles from './index.module.css'

const AddPDF = ({ onAddFile }) => {
  const inputRef = useRef(null) // 使用ref让div具有点击input的效果

  const handleDivClick = () => {
    inputRef.current.click()
  }

  const handlleLabelClick = (event) => {
    event.stopPropagation()
  }
  return (
    <div className={styles.addPDFContainer} onClick={handleDivClick}>
      <label className={styles.addButton} onClick={handlleLabelClick}>
        <UploadOutlined />
        <input
          ref={inputRef}
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
