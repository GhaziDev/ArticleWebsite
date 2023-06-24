import React from 'react';

import styled from 'styled-components';

const Switch = styled.label`
position:relative;
display: inline-block;
width:75px;
height:50px;
border-radius: 20px;

`

const Input = styled.input.attrs({type:"checkbox"})`
  position:relative;
  opacity:0;
  width:0;
  height:0;

  &:checked+Slider:before{
    transform:translateX(30px);
    background:url(${props=>props.theme.setIcon});

  };

`


const Slider = styled.span`
display: inline-block;
z-index:4;
cursor:pointer;
top:1px;
right: 0;
left:10px;
bottom:0;
transition: 0.9s;
height:50px;
width:50px;
border-radius: 50%;
background-color:${props=>props.theme.setChecked?'white':'black'};
&:before{
    display:block;
    position:relative;
    content:"";
    height:30px;
    width:30px;
    border-radius: 50%;
    top:20%;
    left:20%;

    background:url(${props=>props.theme.setIcon});

};

`

export {Slider,Switch,Input};