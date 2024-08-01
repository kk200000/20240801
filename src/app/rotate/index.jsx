'use client'
import { useState } from 'react'
import { pdfjs } from 'react-pdf'
import styles from './index.module.css'
import dynamic from 'next/dynamic'
import { saveAs } from 'file-saver'
import { PDFDocument, degrees } from 'pdf-lib'
import { v4 as uuidv4 } from 'uuid'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs` //这里调用legacy里面的旧版方法兼容
const PDFViewer = dynamic(() => import('./PDFViewer'), { ssr: false })

const RotatePage = () => {
  const [files, setFiles] = useState([])
  const [rotation, setRotation] = useState(0)
  const [pageRotations, setPageRotations] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]

    if (selectedFile && selectedFile.type === 'application/pdf') {
      setIsLoading(true)
      handleAddFile(selectedFile)

      setRotation(0)
      setPageRotations({})
      setIsLoading(false)
    } else {
      alert('请选择有效的PDF文件')
    }
    event.target.value = '' // 重置输入框，以便可以重新选择相同的文件
  }

  const handleAddFile = (newFile) => {
    const uuid = uuidv4() // 为避免重复增加uuid区分
    const url = URL.createObjectURL(newFile) // 创建新的 URL
    setFiles([
      ...files,
      {
        uuid,
        url,
        name: newFile.name,
      },
    ])
  }

  const rotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360)
  }

  const rotateRight = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleRotatePage = (fileIndex, pageIndex, newRotation) => {
    setPageRotations((prev) => ({
      ...prev,
      [fileIndex]: { ...prev[fileIndex], [pageIndex]: newRotation },
    }))
  }

  const handleFinish = async () => {
    if (files.length === 0) return

    const pdfDoc = await PDFDocument.create()

    for (const file of files) {
      const existingPdfBytes = await fetch(file.url).then((res) =>
        res.arrayBuffer()
      )
      const loadedPdfDoc = await PDFDocument.load(existingPdfBytes)
      const pages = await pdfDoc.copyPages(
        loadedPdfDoc,
        loadedPdfDoc.getPageIndices()
      )
      pages.forEach((page, pageIndex) => {
        const rotation =
          (pageRotations[files.indexOf(file)]?.[pageIndex + 1] || 0) % 360
        page.setRotation(degrees(rotation))
        pdfDoc.addPage(page)
      })
    }

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, 'merged_rotated.pdf')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Rotate</h1>
        <button className={styles.loginButton}>Log in</button>
      </div>
      <div className={styles.buttonGroup}>
        <label className={styles.addButton}>
          <span>Add</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className={styles.hiddenInput}
          />
        </label>
        <button
          onClick={rotateLeft}
          className={` ${
            files.length === 0 ? styles.disabled : styles.rotateButton
          }`}
          disabled={files.length === 0}>
          Left
        </button>
        <button
          onClick={rotateRight}
          className={` ${
            files.length === 0 ? styles.disabled : styles.rotateButton
          }`}
          disabled={files.length === 0}>
          Right
        </button>
        <button
          onClick={handleFinish}
          className={`${styles.finishButton} ${
            files.length === 0 ? styles.disabled : ''
          }`}
          disabled={files.length === 0}>
          Finish
        </button>
      </div>
      {isLoading && <div className={styles.loader}>加载中...</div>}
      {files.length > 0 && (
        <div className={styles.rowGroup}>
          <PDFViewer
            files={files}
            rotation={rotation}
            onRotatePage={handleRotatePage}
            handleFileChange={handleFileChange}
          />
        </div>
      )}
      {files.length === 0 && (
        <div className={styles.dropZone}>
          <p>添加 PDF、图片、Word、Excel 和 PowerPoint 文件</p>
        </div>
      )}
    </div>
  )
}

export default RotatePage
