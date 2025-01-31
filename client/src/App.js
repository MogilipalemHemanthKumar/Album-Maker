import React, {useState, useEffect} from 'react'
import { getImages,getSearch } from './api';
import './App.css'
import { UploadWidget } from './UploadWidget';
import { Modals } from './Modals';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.jpg';




const App = () => {
  const [imageList, setImageList] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [searchValue, setSearchValue]= useState('');
  const [temp, setTempValue]=useState(0);
  useEffect(()=>{
    
    const fetchdata = async()=>{
      const responseJson=await getImages();   
      setImageList(responseJson.resources);
      setNextCursor(responseJson.next_cursor);
    }
    fetchdata();
  }, [imageList]);

  const loadImagesHandler=async ()=>{
    const responseJson=await getImages(nextCursor);
      setImageList((currentimagelist)=>[...currentimagelist,...responseJson.resources,]);
      setNextCursor(responseJson.next_cursor);
  }

  const loadSearchHandler=async(event)=>{
    event.preventDefault();
    const responseJson=await getSearch(searchValue,nextCursor);
    setTempValue(1);
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);
  }

  const imageRestoreHandler=async()=>{
    setSearchValue('');
    const responseJson= await getImages();
    setTempValue(0);
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);
  }
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (<>
   
   <div class="menu-bar">
  <div class="ie-album-title">
  <nav class="navbar navbar-default probootstrap-navbar">
  <div class="container">
  <div class="navbar-header" style={{ display: "flex", alignItems: "center" }}>
  <a class="navbar-brand" href="/" title="IE NITK">
    <img src={logo} alt="Logo" style={{ width: "50px", marginRight: "10px" }} />
    <span style={{ fontWeight: "bold", fontSize: "20px", color: "white" }}>IE ALBUM</span>
  </a>
</div>

  </div>
</nav>

  </div>
  <ul>
    <li class="active"><a href="#"><i class="fa fa-home"></i></a>Home</li>
    <li><a href="https://ie.nitk.ac.in/"><i class="fa fa-users"></i></a>About Us</li>
    <li><a href="#"><i class="fa fa-clone"></i></a>Services</li>
    <li><a href="#"><i class="fa fa-angellist"></i></a>Team</li>
    <li><a href="#"><i class="fa fa-phone"></i></a>Contact Us</li>
    <li><a href="#"><i class="fa fa-edit"></i></a>Login</li>
  </ul>
  </div>
  <div class="sidebar">
    <div class="buttons" >
      <button class="butt">Recent</button>
      <button class="butt">Yesterday</button>
      <button class="butt">Last Week</button>
      <button class="butt">Last month</button>
      <button class="butt">Last Year</button>
    </div>
  </div>
   
    <form className='form' onSubmit={loadSearchHandler}>
      <input value={searchValue} onChange={(event)=> setSearchValue(event.target.value)} required='required' placeholder='Enter a search value...' id='search' ></input>
      <button type='submit'>search</button>
      <button type='reset'>clear</button>
      {temp===1?<button type='button' onClick={imageRestoreHandler}>All Images</button>:''}
    </form>
    

    


    <div className='image-grid'>{
      imageList.map((image)=>(<Modals className='grid-item' img_id={image.public_id} img_src={image.url}/>))
      }</div>
    <div className='footer'>
      {nextCursor && <button onClick={loadImagesHandler} >Load More Images</button>}
    </div>
    <div className='hmmm'>
      { imageList.length===0 ? <p>Sorry, no image found of that name</p>: ''}
    </div>
    <div className='upl'>
      <UploadWidget imageList={imageList} setImageList={setImageList}/>
    </div>
    </>
  );
};
export default App;
