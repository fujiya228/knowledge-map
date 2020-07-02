<template>
  <div id="toolbar">
    <button class="ql-bold">Bold</button>
    <button class="ql-italic">Italic</button>
    <button class="ql-underline">Underline</button>
    <button class="ql-strike">Strike</button>
    <button class="ql-blockquote">Blockquote</button>
    <button class="ql-code-block">Code</button>
    <button class="ql-list" value="ordered"></button>
    <button class="ql-list" value="bullet"></button>
    <button class="ql-script" value="sub"></button>
    <button class="ql-script" value="super"></button>
    <button class="ql-indent" value="+1"></button>
    <button class="ql-indent" value="-1"></button>
    <button class="ql-direction" value="rtl"></button>
    <button class="ql-clean"></button>
    <button class="ql-link"></button>
    <button class="ql-video"></button>
    <select class="ql-header">
      <option value="1">h1</option>
      <option value="2">h2</option>
      <option value="3">h3</option>
      <option value="4">h4</option>
      <option value="5">h5</option>
      <option value="6">h6</option>
      <option selected>p</option>
    </select>
    <select class="ql-color"></select>
    <select class="ql-background"></select>
    <select class="ql-align"></select>
    <select class="ql-size">
      <option value="small"></option>
      <option selected></option>
      <option value="large"></option>
      <option value="huge"></option>
    </select>
    <select class="ql-font">
      <option selected="selected"></option>
      <option value="serif"></option>
      <option value="monospace"></option>
    </select>
  </div>
</template>

<style lang="scss" scoped>
#toolbar {
  background: white;
}
</style>