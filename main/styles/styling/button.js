import styled from "styled-components";

const Button = styled.button`
background-color: white;
color: ${(props)=>props.theme.setColor};
border-color: ${(props)=>props.filter.tag.includes(props.name)?'#4A80D5':'grey'};
color: ${(props)=>props.filter.tag.includes(props.name)?'#4A80D5':'grey'};
border: 2px solid;
outline: none;
border-radius: 11px;
width: fit-content;
height: 35px;
font-size: 17px;
text-align: ${(props)=>props.filter.tag.includes(props.name)?'right':'center'};
&:before {
    content: '${(props)=>props.filter.tag.includes(props.name)?'\\2713':''}';
    
};

`




export default Button;