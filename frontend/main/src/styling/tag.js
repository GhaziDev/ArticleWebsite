import styled from "styled-components";

const Tag = styled.button`
background-color: white;
color: ${(props)=>props.theme.setColor};
border-color: ${(props)=>props.selected===props.value?'#4A80D5':'grey'};
color: ${(props)=>props.selected===props.value?'#4A80D5':'grey'};
border: 2px solid;
outline: none;
border-radius: 11px;
width: fit-content;
height: 35px;
font-size: 17px;
text-align: ${(props)=>props.selected===props.value?'right':'center'};
&:before {
    content: '${(props)=>props.selected===props.value?'\\2713':''}';
    
};

`




export default Tag;