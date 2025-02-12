import { useState } from 'react'
import { fileOpen } from 'browser-fs-access'
import Header from './Header'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress';
import {htmlText} from '../data/ruth'

export default function AppLayout() {
  const [usfmText, setUsfmText] = useState()
  // const [htmlText, setHtmlText] = useState()
  const [loading, setLoading] = useState(false)
  const [htmlFileLoaded, setHtmlFileLoaded] = useState(false)

  const handleOpen = async () => {
    setLoading(true)
    // const file = await fileOpen([
    //   {
    //     description: 'USFM - text files',
    //     mimeTypes: ['text/*'],
    //     extensions: ['.usfm'],
    //   }
    // ])
    // const filePath = file?.name
    // if (filePath !== null) {
    //   const extStr = filePath?.substring(filePath?.lastIndexOf("."))
    //   if (extStr === ".usfm") {
    //     const contents = await await file.text()
    //     setUsfmText(contents)
    //     setHtmlFileLoaded(true)
    //     setLoading(false)
    //   } else {
    //     console.log("invalid file extension")
    //   }
    // } else {
    //   console.log("invalid file")
    // }
    // setHtmlText(htmlText)
    setHtmlFileLoaded(true)
    setLoading(false)
  }

  const editorProps = {
    usfmText,
    htmlText
  }
 
  const appBarAndWorkSpace = 
    <div>
      { usfmText && (
        <div>
          {JSON.stringify(editorProps)}
        </div>
      )}
      { htmlFileLoaded && (
        <div
          dangerouslySetInnerHTML={{__html: htmlText}}
        />
      )}
    </div>

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ position: 'fixed', top: 0, left: 0, right: 0 }} elevation={3}>
        {!htmlFileLoaded && !loading && 
          (<Header 
            title={"Html2Usfm Converter"}
            onOpenClick={handleOpen}
          />)}
      </Paper>
      {!loading ? appBarAndWorkSpace : (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            paddingTop: '150px' 
          }}>
          <CircularProgress disableShrink/>
        </Box>
      )}
      </Box>
  )
}
