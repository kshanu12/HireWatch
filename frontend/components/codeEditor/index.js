import AceEditor from "react-ace";
import React, { Component } from "react";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/python";

class CodeEditor extends Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(newValue, event) {
    const editor = this.ace.editor;
    this.props.setCode(newValue);
  }

  render() {
    return (
      <AceEditor
        mode="python"
        theme="monokai"
        onChange={this.onChange}
        fontSize={25}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        style={{ height: "400px",width:"1632px" ,marginLeft:"5px",borderRadius:"5px",marginTop:"5px"}}
        ref={(instance) => {
          this.ace = instance;
        }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
        }}
      />
    );
  }
}
export default CodeEditor;