const helpContent = [
  {
    title: '基本の使い方',
    sub: [
      {
        title: '要素の追加',
        content: '<a href="/map-free" target="_blank">マップを表示</a>した状態で方眼のエリアをクリックします。表示されるフォームから作成できます。'
      },
      {
        title: '要素の削除',
        content: '以下の方法で削除できます。\
        <ul>\
          <li>要素を選択した状態でトップバーにあるボタンから削除</li>\
          <li>要素を右クリックして表示されるメニューから削除</li>\
        </ul>'
      },
      {
        title: '要素の編集',
        content: '以下の方法からエディター表示・利用して編集できます。\
        <ul>\
          <li>要素を選択した状態でトップバーにあるボタンから編集ページへ移動</li>\
          <li>要素を右クリックして表示されるメニューから「編集ページ」をクリックして編集ページへ移動</li>\
          <li>要素をダブルクリックでポップアップエディタを表示</li>\
        </ul>'
      },
      {
        title: '保存',
        content: '以下の方法でデータを保存できます。\
          <ul>\
            <li>サイドバー＞Menuから保存を選択。タイトルを入力し保存場所指定</li>\
            <li>Ctrl + S　のショートカット（データベースへ保存）</li>\
          <ul/>'
      }
    ]
  },
  {
    title: 'サイドバー',
    sub: [
      {
        title: 'ログイン・ログアウト',
        content: 'Menuの一番上（人の形を下アイコン）でログイン・ログアウトができます。'
      },
      {
        title: '保存',
        content: '現在編集中のマップを保存できます。保存先は以下のとおりです。\
          <ul>\
            <li>ブラウザに保存（使用中のデバイスのブラウザに記録します）</li>\
            <li>ファイルとして保存（使用中のデバイスにファイルとしてダウンロードします）</li>\
            <li>データベースに保存（サーバーに保存し、他のデバイスからもアクセスが可能です）</li>\
          <ul/>'
      },
      {
        title: '読み込み',
        content: '過去に保存したマップを読み込むことができます。読み込み元は以下のとおりです。\
          <ul>\
            <li>ブラウザから（使用中のデバイスに保存されたマップを読み込みます）</li>\
            <li>ファイルとして保存（使用中のデバイスからファイルを選択していただき読み込みます）</li>\
            <li>データベースに保存（サーバーに保存されているデータの一覧が表示されます。その中から選択していただいたものを読み込みます）</li>\
          <ul/>'
      },
      {
        title: '新規作成',
        content: '新しいマップを作成できます。（現在編集中のマップはデータベースに保存されます）'
      },
      {
        title: 'ステータス',
        content: '登録されている「ステータス」のタイトルや色、順番を編集したり、新しいステータスの追加、既存のステータスの削除ができます。'
      },
      {
        title: '要素検索',
        content: '検索バーから入力した文字列に部分一致する「タイトル」を持つ要素を検索できます。※全角と半角は区別して検索されます'
      },
      {
        title: '要素追加',
        content: '検索バーの下にある「＋」ボタンを押すと、追加用フォームが出現し、そこで新しい要素を追加できます。'
      },
      {
        title: 'ステータス絞り込み',
        content: '検索バーの下にある「旗」ボタンを押すと、ステータスの一覧が表示されます。そこで選択したステータスのみに絞り込んで一覧表することができます。'
      },
      {
        title: '要素選択',
        content: '一覧にある要素をクリックすることで要素を選択できます。'
      },
      {
        title: '要素削除',
        content: '一覧にある要素の右にある「ゴミ箱」をクリックすることで要素を削除できます。'
      },
    ]
  },
  {
    title: 'トップバー',
    sub: [
      {
        title: 'サイドバーの開閉',
        content: 'サイドバーを開いたり閉じたりできます。'
      },
      {
        title: 'タイトル編集（選択時のみ）',
        content: '選択中の要素のタイトルを表示している部分をクリックしてタイトルを編集することができます。'
      },
      {
        title: '削除（選択時のみ）',
        content: 'ボタンで選択中の要素を削除出することができます。'
      },
      {
        title: '拡大・縮小・リセット（マップページのみ）',
        content: 'マップの表示を拡大・縮小・リセットすることができます。'
      },
      {
        title: 'ページの遷移（選択時のみ）',
        content: '編集ページやマップページへ移動できます。'
      },
      {
        title: 'Contact',
        content: 'こちらから運営へ質問やご意見などしていただけます。'
      },
      {
        title: 'Help',
        content: '現在読んでいるものです。わかりづらい点や書いてあることと違ったりしていましたら、「Contact」よりご連絡いただけますと幸いです。'
      },
    ]
  },
  {
    title: 'マップ',
    sub: [
      {
        title: '要素の追加',
        content: '方眼のエリアをクリックし、表示されるフォームから作成できます。'
      },
      {
        title: 'ドラッグ・アンド・ドロップ（移動）',
        content: '要素をドラッグ・アンド・ドロップで移動できます。'
      },
      {
        title: 'ドラッグ・アンド・ドロップ（スクロール）',
        content: '方眼のエリアをドラッグ・アンド・ドロップでスクロールすることができます。'
      },
      {
        title: '関連付け（Shift + クリック）',
        content: '要素を　Shift + クリックすることで、他の要素と関連付けすることができます。'
      },
      {
        title: 'ポップアップエディター表示（ダブルクリック）',
        content: '要素をダブルクリックすることでポップアップエディターを表示することができます。'
      },
      {
        title: 'コンテキストメニュー（右クリック）',
        content: '要素を右クリックすることでコンテキストメニューを表示することができます。以下のような操作ができます。\
        <ul>\
          <li>タイトル編集</li>\
          <li>要素削除</li>\
          <li>関連付ける</li>\
          <li>ステータス編集</li>\
          <li>編集ページへ移動</li>\
        </ul>'
      },
    ]
  },
  {
    title: 'エディター（編集ページも同様）',
    sub: [
      {
        title: '関連一覧表示',
        content: '選択中に関連付けされた要素の一覧を閲覧・関連付け解除・新規関連付けすることができます。'
      },
      {
        title: 'エディターの表示・非表示',
        content: 'エディターを表示・非表示で切り替えることができます。'
      },
      {
        title: 'プレビューの表示・非表示',
        content: 'プレビューを表示・非表示で切り替えることができます。'
      },
      {
        title: 'カスタムリンク作成',
        content: '編集中の文章内に既存の要素へのリンクを作成することができます。<br/><strong>新しく作った要素へのリンクは、その要素を保存していない場合はクリックしても存在しないので注意してください。</strong>'
      },
      {
        title: 'ステータス編集',
        content: 'ステータスを編集することができます。'
      },
    ]
  },
]

export default helpContent