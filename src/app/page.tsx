import RotatePage from './rotate'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
export default function Home({ pageProps }: any) {
  return <RotatePage {...pageProps}></RotatePage>
}
