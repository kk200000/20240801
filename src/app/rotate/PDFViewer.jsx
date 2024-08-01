import React, { useState, useEffect } from 'react'
import { Document, Page } from 'react-pdf'
import styles from './index.module.css'
import { Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import dynamic from 'next/dynamic'

const PDFViewer = ({ files, rotation, onRotatePage,handleFileChange }) => {
  const [numPages, setNumPages] = useState({})
  const [pageRotations, setPageRotations] = useState({})
  const AddPDF = dynamic(() => import('./AddPDF'), { ssr: false })

  const onDocumentLoadSuccess = (fileIndex, { numPages }) => {
    setNumPages((prev) => ({ ...prev, [fileIndex]: numPages }))
  }

  const handlePageRotation = (fileIndex, pageIndex) => {
    const newRotation = (pageRotations[fileIndex]?.[pageIndex] || 0) + 90
    setPageRotations((prev) => ({
      ...prev,
      [fileIndex]: { ...prev[fileIndex], [pageIndex]: newRotation },
    }))
    onRotatePage(fileIndex, pageIndex, newRotation)
  }

  useEffect(() => {
    setPageRotations({})
  }, [files])

  return (
    <div className={styles.pdfViewer}>
      {files.map((file, fileIndex) => (
        <div key={`document_${fileIndex}`}>
          <Document
            className={styles.fileContainer}
            file={file.url}
            onLoadSuccess={(e) => onDocumentLoadSuccess(fileIndex, e)}>
            {Array.from(
              new Array(numPages[fileIndex] || 0),
              (el, pageIndex) => (
                <div
                  key={`page_${fileIndex}_${pageIndex + 1}`}
                  className={styles.pageContainer}>
                  <Page
                    pageNumber={pageIndex + 1}
                    rotate={
                      rotation +
                      (pageRotations[fileIndex]?.[pageIndex + 1] || 0)
                    }
                    width={200} // 设置宽度
                  />

                  <Button
                    className={styles.centerRotateButton}
                    onClick={() => handlePageRotation(fileIndex, pageIndex + 1)}
                    type="primary"
                    icon={<ReloadOutlined />}
                    iconPosition="end"></Button>
                  <div className={styles.pageNumber}>{pageIndex + 1}</div>
                  <div className={styles.fileName}>{file.name}</div>
                </div>
              )
            )}
          </Document>
        </div>
      ))}

      <AddPDF onAddFile={handleFileChange} />
    </div>
  )
}

export default PDFViewer
