import { parse } from "node-html-parser";

const isVerifiedWithBcvStruct = true
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

const getAttributes = (node) => {
  const atts = node.attributes;
  return !atts.length
    ? typeof atts === "object" && atts
    : [...atts].reduce((atts, att) => {
        atts[att.name] = att.value;
        return atts;
      }, {});
};

const camelToKebabCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const kebabDataSet = (target) =>
  Object.keys(target).reduce((dataset, key) => {
    const newKey = camelToKebabCase(key);
    dataset[newKey] = target[key];
    return dataset;
  }, {});

const getDataset = (node) => {
  const dataSet = node.dataset;
  if (dataSet) return kebabDataSet(dataSet);
  const atts = getAttributes(node);
  return (
    atts &&
    Object.keys(atts).reduce((dataset, key) => {
      const data = key.match(/(?<=data-).+/);
      if (data) dataset[data] = atts[key];
      return dataset;
    }, {})
  );
};

const getProps = (node) => {
  const {
    "subtype-ns": subtypeNs,
    subtype: rawSubtype,
    ...dataset
  } = getDataset(node);
  const subtype = {
    subtype: subtypeNs ? `${subtypeNs}:${rawSubtype}` : rawSubtype
  };
  const props =
    dataset &&
    Object.keys(dataset).reduce((props, key) => {
      const att = key.match(/(?<=atts-).+/);
      if (att) {
        if (!props.atts) props.atts = {};
        props.atts[att] = dataset[key];
      } else props[key] = dataset[key];
      return props;
    }, {});
  const type = props?.type
  let retObj = {}
  if (type === "mark") {
    if (props["bcv-id"]) {
      retObj = { bcvIdStr: props["bcv-id"] }
    }
  } else {
    retObj = { ...props, ...subtype }
  }
  return retObj
};

const getContentFrom = (contentNode,ws)=> {
  let content = [];
  for (const node of contentNode.childNodes) {
    if (node.nodeType === TEXT_NODE) {
      if (isVerifiedWithBcvStruct) {
        if (!ws.patchObj[ws.curBcvId]) ws.patchObj[ws.curBcvId] = { replace: [] }
        ws.patchObj[ws.curBcvId].replace.push(node.textContent)
      }
      continue;
    }
    if (node.getAttribute("class") === "meta-content") continue;
    const curBlock = getBlock(node,ws);
    if (curBlock?.bcvIdStr) {
      ws.curBcvId = curBlock?.bcvIdStr
    } else if ((curBlock?.type) && (isVerifiedWithBcvStruct)) {
      if (!ws.patchObj[ws.curBcvId]) ws.patchObj[ws.curBcvId] = { replace: [] }
      ws.patchObj[ws.curBcvId].replace.push(curBlock)
    }
  }
  return content;
}

const blockFrom = (node,ws)=> {
  if (node.hasAttribute("data-atts-number")) return {};
  const metaContent = node.querySelector(":scope > .meta-content");
  return {
    content: getContentFrom(node,ws)|| [],
    ...(metaContent && { meta_content: getContentFrom(metaContent,ws)|| [] })
  };
};

const getBlock = (node,ws) => {
  const props = getProps(node);
  const defaultContent = ["paragraph"].includes(props.type) && { content: [] };
  return {
    ...props,
    ...(node.childNodes.length ? blockFrom(node,ws) : defaultContent)
  };
};

const browserGetBlocks = (nodes,ws) => nodes && Array.from(nodes, (node) => getBlock(node,ws));

const nodeJsGetBlocks = (nodes,ws) =>
  nodes && nodes.reduce((blocksList, node) => {
    if (node.nodeType !== ELEMENT_NODE) return blocksList;
    blocksList.push(getBlock(node,ws));
    return blocksList;
  }, []);

const getBlocksFrom = (containerNode,ws) =>
  typeof containerNode.children === "object"
    ? browserGetBlocks(containerNode.children,ws)
    : nodeJsGetBlocks(containerNode.childNodes,ws)

const parseHtml = (html) =>
  typeof DOMParser === "function"
    ? new DOMParser().parseFromString(html, "text/html")
    : parse(html);

function html2usfm(htmlText) {
  const tmpDoc = parseHtml(htmlText);
  // const sequenceElement = sequencesHtml.getElementById(sequenceId);
  const sequenceElement = {}
  const workspace = {
    curBcvId: "",
    patchObj: {}
  }
  const blocks = getBlocksFrom(sequenceElement,workspace)
  console.log(blocks)
  // return workspace.patchObj
  const tempEl = tmpDoc.documentElement
  var links = Array.from(tempEl.querySelectorAll("a"))
  const refList = links.map(link =>{
    return decodeURI(`${link.innerText} -> ${link.href}`)
  })
  return `All references: <br/><br/>${refList.join("<br/>")}`
}

export default html2usfm;
