import React, { Component, useState, Fragment, useEffect  } from 'react';
import { withStyles } from '@mui/styles';
import { AppBar, Toolbar, Typography, Button, IconButton, Modal, Dialog } from "@mui/material";
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import MUIDataTable from "mui-datatables";

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
    display: 'block',
    color: "#fff"
  },
});

function App() {
	const classes = styles();	
	const [open, setOpen] = useState(false);
	const toggleShow = () => setOpen(!open);
	const [dialogState, setDialogState] = useState({ open: false, edit: false });
	const [apiRes, setApiRes] = useState([]);
	const [viewData, setViewData] = useState([]);
	
	const loadContentFromServer = () => {
		const url = 'https://engineering-task.elancoapps.com/api/raw';

		fetch(url)
		.then(response => response.json())
		.then(json => {
		 setApiRes(json);
		});
	}
	useEffect(()=>{
		loadContentFromServer();
	},[])
		const handleOpen = () => {
			setDialogState({ open: true });
			setOpen(true);
		};
		
		const handleClose = () => {
			setDialogState({ open: false });
		};
		
		const ViewButton = data => {
			setDialogState({ edit: true });
			setViewData([{ ConsumedQuantity: data[0], Cost: data[1], Date: data[2], MeterCategory: data[3], ResourceGroup: data[4],ResourceLocation:data[5]} ]);
			handleOpen();
		};
		
		const columns = [
		  { name: 'ConsumedQuantity', options: {filter: false} },
		  { name: 'Cost', options: {filter: false} },
		  { name: 'Date', options: {filter: false} },
		  { name: 'MeterCategory', options: {filter: false} },
  		  { name: 'ResourceGroup', options: {filter: false} },
  		  { name: 'ResourceLocation', options: {filter: false} },
		  { name: "Action", 
			options: {
			  filter: true,
			  customBodyRender: (value, tableMeta, updateValue) => {
				return (
				  <button onClick={() => {
					ViewButton(tableMeta.rowData)
				  }}
                  className="button muted-button"
				  >View Details</button>
				);
			  }
			}
		  }
		];
		
		const options = {
		  filterType: "dropdown",
		responsive: "stacked",
		filter: false,
		download: false,
		print: false,
		selectableRows: false,
		};
		
		return (
			<div className={classes.root}>
				<AppBar position="static">
					  <Toolbar>
						<Typography variant="h6" className="">
						  ELANCO App
						</Typography>
					  </Toolbar>
				</AppBar>
				
				<MUIDataTable
				title={"Raw Data"}
				data={apiRes}
				columns={columns}
				options={options}
				/>
								
				<Dialog
				fullWidth={500}
				open={open}
				onClose={handleClose}
			      >
				<AppBar sx={{ position: 'relative' }}>
				  <Toolbar>
				    <Typography sx={{ ml: 3, flex: 1 }} variant="h6" component="div">
				      View Details
				    </Typography>
				    <IconButton
				      edge="end"
				      color="inherit"
				      onClick={()=>setOpen(false)}
				      aria-label="close"
				    >
				      <CloseIcon />
				    </IconButton>
				  </Toolbar>
				</AppBar>
				<List>
			  		{viewData && viewData.map((ele)=>{
						return(
							<>
							<ListItem button>ConsumedQuantity: {ele.ConsumedQuantity}</ListItem>
							<ListItem button>Cost: {ele.Cost}</ListItem>
							<ListItem button>Date: {ele.Date}</ListItem>
							<ListItem button>MeterCategory: {ele.MeterCategory}</ListItem>
							<ListItem button>ResourceGroup: {ele.ResourceGroup}</ListItem>
							<ListItem button>ResourceLocation: {ele.ResourceLocation}</ListItem>	
							</>
						);
					})}
				  <Divider />
				</List>
			      </Dialog>
			</div>
		);
}
export default withStyles(styles)(App);

