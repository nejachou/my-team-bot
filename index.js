'use strict';
require('dotenv').config();
const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a selective echoing text message
  let msg;
  let outputMsg;
  if (event.message.text.includes('早安')) {
    msg = {
      type: 'buttons',
      text: '每天都會用到的...',
      actions: [
        {
          type: 'uri',
          label: 'ERP',
          uri: 'https://www.elite-erp.com.tw:8443/erp/login?corpCode=TPI',
        },
        {
          type: 'uri',
          label: '訂便當管理系統',
          uri: 'https://www.dinbendon.net/do/',
        },
        {
          type: 'uri',
          label: '每日體溫量測',
          uri:
            'https://docs.google.com/forms/d/13jERXT95rRX_fSmNZu0TMxhwWIfxNFZMbLX9kfEOt-s/viewform?edit_requested=true',
        },
      ],
    };
    outputMsg = {
      type: 'template',
      altText: '每日例行公事連結',
      template: msg,
    };
  } else if (
    event.message.text.includes('打卡') ||
    event.message.text.toLowerCase().includes('erp')
  ) {
    msg = 'ERP ' + 'https://www.elite-erp.com.tw:8443/erp/login?corpCode=TPI';
    outputMsg = { type: 'text', text: msg };
  } else if (event.message.text.includes('體溫')) {
    msg =
      '記得填量體溫喔~ ' +
      'https://docs.google.com/forms/d/13jERXT95rRX_fSmNZu0TMxhwWIfxNFZMbLX9kfEOt-s/viewform?edit_requested=true';
    outputMsg = { type: 'text', text: msg };
  } else if (
    event.message.text.includes('便當') &&
    event.message.text.toLowerCase().includes('excel')
  ) {
    msg =
      'https://docs.google.com/spreadsheets/u/1/d/1yws-Q-IHQEApvAhpuNgRLxoJqbb6GnCm2OI8kwwi4s8/edit?ts=5e4b44c0#gid=0';
    outputMsg = { type: 'text', text: msg };
  } else if (event.message.text.includes('便當')) {
    msg = 'https://www.dinbendon.net/do/';
    outputMsg = { type: 'text', text: msg };
  } else if (event.message.text.includes('高鐵')) {
    msg = '高鐵查詢 ' + 'https://irs.thsrc.com.tw/IMINT/?locale=tw';
    outputMsg = { type: 'text', text: msg };
  }
  if (
    event.message.text.toLowerCase().includes('hi') ||
    event.message.text.toLowerCase().includes('hello') ||
    event.message.text.includes('你好') ||
    event.message.text.includes('您好') ||
    event.message.text.includes('安安')
  ) {
    msg = 'Hi, 安安~';
    outputMsg = { type: 'text', text: msg };
  } else if (event.message.text.toLowerCase().includes('小火龍')) {
    msg = '嗯？你在叫我嗎？';
    outputMsg = { type: 'text', text: msg };
  } else if (
    event.message.text.includes('是誰') ||
    event.message.text.includes('你哪位') ||
    event.message.text.toLowerCase().includes('who')
  ) {
    msg = `我是"小火龍",烤肉生火我最快,上班無聊可以找我聊天,我如果沒有睡著,就會回你,啾咪~`;
    outputMsg = { type: 'text', text: msg };
  } else if (
    event.message.text.includes('沒電') ||
    event.message.text.includes('想睡') ||
    event.message.text.includes('很累') ||
    event.message.text.includes('好累') ||
    event.message.text.includes('累了') ||
    event.message.text.includes('睡覺') ||
    event.message.text.includes('無聊') ||
    event.message.text.includes('睡著')
  ) {
    outputMsg = { type: 'sticker', packageId: '11539', stickerId: '52114121' };
  } else if (event.message.text.includes('加油')) {
    outputMsg = { type: 'sticker', packageId: '11539', stickerId: '52114122' };
  } else if (
    event.message.text.includes('想吃') ||
    event.message.text.includes('想喝')
  ) {
    msg = '不過...是不是該減肥了? ';
    outputMsg = { type: 'text', text: msg };
  } else if (
    (event.message.text.includes('覺得') &&
      event.message.text.includes('可以')) ||
    event.message.text.toLowerCase().includes('ok')
  ) {
    msg = '我也覺得可以~';
    outputMsg = { type: 'text', text: msg };
  } else if (
    event.message.text.includes('討厭') ||
    event.message.text.includes('生氣')
  ) {
    outputMsg = { type: 'sticker', packageId: '11539', stickerId: '52114142' };
  } else if (event.message.text.includes('這裡')) {
    msg = '這裡是指哪裡?';
    outputMsg = { type: 'text', text: msg };
  } else if (event.message.text.includes('那裡')) {
    msg = '那裡是指哪裡?';
    outputMsg = { type: 'text', text: msg };
  } else if (event.message.text.includes('野生')) {
    msg = '野生?? 在哪裡? 我也要看!';
    outputMsg = { type: 'text', text: msg };
  } else if (
    event.message.text.includes('忘記') ||
    event.message.text.includes('想不起來')
  ) {
    msg = '忘記不是忘記,只是想不起來而已,而會忘記的事情,都是不重要的事情~';
    outputMsg = { type: 'text', text: msg };
  } else if (
    event.message.text.includes('問天氣') ||
    event.message.text.includes('雨機率') ||
    event.message.text.includes('查天氣') ||
    event.message.text.includes('下雨嗎')
  ) {
    msg = '讓我跟你報告天氣吧 ' + 'https://www.google.com/search?q=weather';
    outputMsg = { type: 'text', text: msg };
  } else if (event.message.text.includes('問火車')) {
    msg =
      '臺鐵查詢 ' +
      'https://tip.railway.gov.tw/tra-tip-web/tip/tip001/tip112/gobytime';
    outputMsg = { type: 'text', text: msg };
  } else if (event.message.text.includes('星座運勢')) {
    msg = '星座運勢 ' + 'http://astro.click108.com.tw/index.php';
    outputMsg = { type: 'text', text: msg };
  } else if (
    event.message.text.includes('強') ||
    event.message.text.includes('厲害') ||
    event.message.text.includes('高手') ||
    event.message.text.includes('酷') ||
    event.message.text.includes('炫') ||
    event.message.text.includes('猛') ||
    event.message.text.includes('拍手') ||
    event.message.text.includes('鼓掌') ||
    event.message.text.includes('了不起')
  ) {
    outputMsg = { type: 'sticker', packageId: '11537', stickerId: '52002752' };
  } else if (
    event.message.text.includes('熱') &&
    !event.message.text.includes('門')
  ) {
    outputMsg = { type: 'sticker', packageId: '11537', stickerId: '52002757' };
  } else if (event.message.text.includes('怎麼了')) {
    outputMsg = { type: 'sticker', packageId: '11539', stickerId: '52114129' };
  } else if (
    event.message.text.includes('心碎') ||
    event.message.text.includes('傷心') ||
    event.message.text.includes('難過') ||
    event.message.text.includes('哭') ||
    event.message.text.includes('崩潰')
  ) {
    outputMsg = { type: 'sticker', packageId: '11537', stickerId: '52002750' };
  } else {
    return Promise.resolve(null);
  }

  // use reply API
  return client.replyMessage(event.replyToken, outputMsg);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
