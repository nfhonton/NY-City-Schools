// Description: Create an iOS app that provides information on NYC High schools.

import * as React from 'react';

// react native imports for displaying application 
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
} from 'react-native';

// class declaration 
export default class App extends React.Component {
	
	// constructor - set up State and get json
	constructor(props) {
		super(props);
		this.state = {
			modalIsOpen: false,
			schoolList: '',
			satScores: '',
			currentSchool: '',
		};

		this.retrieveSchoolList();
		this.retrieveSchoolScores();
	}

	// show the Modal 
	showModal(school) {
		this.setState({modalIsOpen: true, currentSchool: school});
	}

	// close the Modal 
	closeModal() {
		this.setState({modalIsOpen: false, currentSchool: ''});
	}

	// the Modal that shows information about a selected School 
	infoModal() {
		const school = this.state.currentSchool;
		const sat = this.state.satScores;

		// if values have not been set up yet, return immediately
		if (sat === '' || school === '') {
			return (<View />);
		}

		// find the school's SAT scores

		var scores = sat.find(function(s) {
			return s.dbn === school.dbn
		});

		return (
			<Modal
				transparent={true}
				animationType={'slide'}
				visible={this.state.modalIsOpen}
			>
				{/* Semi-clear background, pressing it will close the modal */}
				<TouchableOpacity
					style={styles.modalBackground}
					onPress={() => this.closeModal()}
				/>
				<View style={styles.modal}>
					{/* Modal Header */}
					<View style={styles.modalHeader}>
						<Text style={styles.headerText}>
							{school.school_name}
						</Text>
					</View>
					{/* School Description*/}
					<Text style={styles.boldModalText}>
						School Description:
					</Text>
					<Text style={styles.modalText}
						ellipsizeMode={'tail'}
						numberOfLines={5}
					>
						{ school.overview_paragraph }
					</Text>
					{/* Print SAT Scores, if found */}
					{
						scores === undefined ? 
						<Text style={styles.boldModalText}>
							Unable to find SAT scores for this school!
						</Text>
						:
						<View>
							{/* reading score */}
							<Text style={styles.boldModalText}>
								Avg. Reading Score:{" "}
								<Text style={styles.modalText}>
									{scores.sat_critical_reading_avg_score}
								</Text>
							</Text>
							{/* writing score */}
							<Text style={styles.boldModalText}>
								Avg. Writing Score:{" "}
								<Text style={styles.modalText}>
									{scores.sat_writing_avg_score}
								</Text>
							</Text>
							{/* math score */}
							<Text style={styles.boldModalText}>
								Avg. Math Score:{" "}
								<Text style={styles.modalText}>
									{scores.sat_math_avg_score}
								</Text>
							</Text>
						</View>
					}
					{/* Close button */}
					<TouchableOpacity style={styles.closeButton}
						onPress={() => this.closeModal()}
					>
						<Text style={styles.closeText}>
							CLOSE
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		)
	}

	// displays the School Name and a View button for it 
	showSchoolInfo(json) {
		return (
			<View style={styles.scrollContainer}>
				<View style={styles.schoolInfo}>
					<Text style={styles.schoolName}>
						{json.school_name}
					</Text>
				</View>
				<TouchableOpacity style={styles.viewButton}
					onPress={()=>this.showModal(json)}
				>
					<Text style={styles.viewText}>
						VIEW
					</Text>
				</TouchableOpacity>
			</View>
		)
	}

	// retrieve the list of schools from the City of New York website
	retrieveSchoolList() {
		fetch('https://data.cityofnewyork.us/resource/s3k6-pzi2.json')
			.then(response => response.json())
			.then((data) => {
				this.setState({schoolList: data});
			})
			.catch((error) => {
				alert('Could not retrieve data from the server! Please try again');
			}
		)
	}

	// retrieve the SAT scores of schools from the City of New York website
	retrieveSchoolScores() {
		fetch('https://data.cityofnewyork.us/resource/f9bf-2cp4.json')
			.then(response => response.json())
			.then((data) => {				
				this.setState({satScores: data});
			})
			.catch((error) => {
				alert('Could not retrieve data from the server! Please try again');
			}
		)
	}

	// map each school to a block
	renderSchools() {
		const info = this.state.schoolList;
		// if school list has not yet been populated, return an empty view 
		if (typeof info != 'object') {
			return (<View />);
		}
		return (info.map((school) => this.showSchoolInfo(school)));
	}

	// app render function
	render() {

		// render return 
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerText}>
						New York City Schools
					</Text>
				</View>
				{ this.infoModal() }
				<ScrollView style={styles.scrollView}>
					{ this.renderSchools() }
				</ScrollView>
			</View>
		);
	}
}

// app styles 
const styles = StyleSheet.create({
	/* main app container */
	container: {
		height: '100%',
		width: '100%',
		backgroundColor: '#121212',
	},
	/* application header */
	header: {
		height: 75,
		width: '100%',
		backgroundColor: '#242424',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 12,
	},
	/* header text */
	headerText: {
		color: '#FDFDFD',
		fontSize: 20,
		textAlign: 'center',
	},
	/* scrollview interior */
	scrollView: {
		paddingHorizontal: 15,
	},
	/* container for the school name and View button */
	scrollContainer: {
		flexDirection: 'row',
		marginTop: 10,
		marginBottom: 20,
	},
	/* school name text */
	schoolName: {
		fontSize: 16,
		color: '#EAEAEA',
		alignSelf: 'center',
		textAlign: 'center',
		margin: 10,
	},
	/* container for the school name */
	schoolInfo: {
		width: '80%',
		backgroundColor: '#424242',
		alignItems: 'center',
		justifyContent: 'center',
	},
	/* Touchable Opacity View button */
	viewButton: {
		marginLeft: 10,
		padding: 10,
		backgroundColor: '#424242',
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'center',
	},
	/* Text style for 'View' */
	viewText: {
		fontSize: 16,
		color: '#EAEAEA',
	},
	/* the tinted background of the modal */
	modalBackground: {
		opacity: .4,
		backgroundColor: '#222222',
		width: '100%',
		height:'100%',
	},
	/* modal container */
	modal: {
		position: 'absolute',
		top: '10%',
		alignSelf: 'center',
		padding: 10,
		width: '90%',
		backgroundColor: '#959595',
	},
	/* modal header container */
	modalHeader: {
		backgroundColor: '#121212',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		paddingVertical: 7,
		width: '100%',
		marginBottom: 10,
	},
	/* main text of modal */
	boldModalText: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#EEEEEE',
	},
	/* subtext of modal */
	modalText: {
		fontSize: 16,
		color: '#EEEEEE',
		paddingBottom: 5,
		fontWeight: 'normal',
	},
	/* CLOSE button container */
	closeButton: {
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		backgroundColor: '#121212',
		marginTop: 15,
	},
	/* CLOSE button text */
	closeText: {
		fontSize: 18,
		color: '#DEDEDE',
		fontWeight: 'bold',
	},
});

// end of file