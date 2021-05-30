import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {Link} from 'react-router-dom';
import {ApplicationState} from '../store';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import * as GoodsStore from '../store/Goods';
// import {DataGrid} from '@material-ui/data-grid'

// At runtime, Redux will merge together...
type GoodsProps =
    GoodsStore.GoodsState // ... state we've requested from the Redux store
    & typeof GoodsStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters


class FetchData extends React.PureComponent<GoodsProps> {
    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.ensureDataFetched();
    }

    // This method is called when the route parameters change
    public componentDidUpdate() {
        this.ensureDataFetched();
    }

    public render() {
        const colums = [{field: 'id', headerName: "ID"}, {field: 'name', headerName: "Name"}]

        const rows = [{id: 1, name: 'Snow'}, {id: 2, name: 'Snow1'}, {id: 3, name: 'Snow2'}]

        return (
            <div>

                <React.Fragment>
                    <h1 id="tabelLabel">Goods</h1>
                    <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
                    {this.renderForecastsTable()}
                    {this.renderPagination()}
                </React.Fragment>
            </div>

        );
    }

    private ensureDataFetched() {
        const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
        this.props.requestGoods(startDateIndex);
    }

    
    
    
    private renderForecastsTable() {
        return (
            <React.Fragment>
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Count</th>
                        <th>idCategories</th>
                        <th>productInfo</th>
                        <th>info</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.goods.map((goods: GoodsStore.Goods) =>
                        <tr key={goods.id}>
                            <td>{goods.id}</td>
                            <td>{goods.name}</td>
                            <td>{goods.count}</td>
                            <td>{goods.idCategories}</td>
                            <td>{goods.productInfo}</td>
                            <td>{goods.info.map((info: GoodsStore.Info) => info.id + "|" + info.dt + "| " + info.price)}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Count</TableCell>
                                <TableCell>Categories</TableCell>
                                <TableCell>Info</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.goods.map((row)=> {
                                <Row key={row.id} row={row}/>
                            })}
                        </TableBody>

                    </Table>
                </TableContainer>

            </React.Fragment>


        );
    }

    private renderPagination() {
        const prevStartDateIndex = (this.props.startDateIndex || 0) - 5;
        const nextStartDateIndex = (this.props.startDateIndex || 0) + 5;

        return (
            <div className="d-flex justify-content-between">
                <Link className='btn btn-outline-secondary btn-sm'
                      to={`/fetch-data/${prevStartDateIndex}`}>Previous</Link>
                {this.props.isLoading && <span>Loading...</span>}
                <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${nextStartDateIndex}`}>Next</Link>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.goods, // Selects which state properties are merged into the component's props
    GoodsStore.actionCreators // Selects which action creators are merged into the component's props
)(FetchData as any); // eslint-disable-line @typescript-eslint/no-explicit-any
