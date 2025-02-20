import { useState } from 'react'
// import { fileOpen } from 'browser-fs-access'
import Header from './Header'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
// import pkg from 'usfm-grammar'
// const {USFMParser} = pkg

// import {htmlText} from '../data/ruth'
import {csvData} from '../data/titus-csv'
// import html2usfm from '../util/html2usfmParser'
import csv2usj from '../util/csv2usjParser'

import Modal from '@mui/material/Modal'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export default function AppLayout() {
  // eslint-disable-next-line no-unused-vars
  const [usfmText, setUsfmText] = useState()
  const [usjText, setUsjText] = useState()
  const [usjLoaded, setUsjLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const handleClose = () => setModalOpen(false)

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
    // const tempUsfm = JSON.stringify(html2usfm(htmlText))
    // const tmpText = html2usfm(htmlText)
    const tempUsj = csv2usj(csvData)
    console.log(tempUsj)
    setUsjLoaded(true)
    setUsjText(JSON.stringify(tempUsj))
    // const usfmParser2 = new USFMParser(null, tempUsj) // USJ to USFM
    // const usfmGen = usfmParser2.usfm;
    const usfmGen = "Test";
    console.log(usfmGen);
    setUsfmText(usfmGen)
    setLoading(false)
    setModalOpen(true)
  }

  const appBarAndWorkSpace = 
    <div>
      { usjLoaded && (
         <div>{usjText}</div>
      )}
    </div>

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ position: 'fixed', top: 0, left: 0, right: 0 }} elevation={3}>
        {!usjLoaded && !loading && 
          (<Header 
            title={"Csv2Usj Converter"}
            onOpenClick={handleOpen}
          />)}
      </Paper>
      <div>
        <Modal
          open={modalOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              USJ ouput (only during the testing phase)
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <span dangerouslySetInnerHTML={{__html: usfmText}} />
            </Typography>
          </Box>
        </Modal>
      </div>
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
