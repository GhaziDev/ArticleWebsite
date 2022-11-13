import styled,{keyframes,css} from 'styled-components'

const expand = keyframes`
0%{
    width:0px;
}
 100%{
    width:1000px;
    height:70px;
 }
`

const SearchBar = styled.input`
  width:1000px;
  outline:none;
  height:70px;
  font-size:25px;
  border:none;


`

export default SearchBar;