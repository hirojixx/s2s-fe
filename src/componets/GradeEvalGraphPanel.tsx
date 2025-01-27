import React from 'react';

import BarGraph from './BarGraph';

import { Controller } from '../data/Controller';
import { GraphDataset } from '../data/Presenter'

interface IGradeEvalGraphPanelProps {
}

interface IGradeEvalGraphPanelState {
  datasets : GraphDataset,
  holdings : Array<number>,
}

class GradeEvalGraphPanel  extends React.Component<IGradeEvalGraphPanelProps, IGradeEvalGraphPanelState>{

  private readonly labels = [
    ["", "1"],
    ["", "2"],
    ["", "3"],
    ["", "4"],
    ["", "5"],
  ]

  private readonly barGraphList = 
    [
      {question: "勉強会の満足度を教えてください", datasets: "satisfaction"},
      {question: "他の人にも今回の発表内容を紹介したいと思いますか？", datasets: "recommendation"},
      {question: "また参加したいと思いましたか？", datasets: "participation"},
      {question: "発表してみたいと思いましたか？", datasets: "presentation"},
    ]

  private controller_ !: Controller;

  /**
   * コンストラクタ
   * 
   * @param props プロパティ
   */
  constructor(props: IGradeEvalGraphPanelProps) {
    super(props);

    this.controller_ = new Controller();

    this.state = {
      datasets : {},
      holdings : new Array<number>(),
    };
    
    this.onChangeSelection = this.onChangeSelection.bind(this)
  }

  /**
   * マウント完了後のコールバック
   */
  componentDidMount() {

    this.controller_.fetchQuestionnaireDataAll()
      .then((questionnaireGraphDataset: GraphDataset) => {
        this.setState({ datasets: questionnaireGraphDataset });
      });

    this.controller_.getLatestHoldingNum()
      .then((latestHoldingNum: number) => {
        let holdings = new Array<number>();
        for(let i = 0; i <= latestHoldingNum; i++){
          holdings.push(i);
        }
        this.setState({ holdings: holdings });
      });
  }

  /**
   * セレクション変更のイベントハンドラ
   * 
   * @param e イベント
   */
  onChangeSelection(e: any) : void {
    const holding_num = e.target.value

    this.controller_.fetchQuestionnaireData(holding_num)
      .then((questionnaireGraphDataset: GraphDataset) => {
        this.setState({ datasets: questionnaireGraphDataset });
      });
  }
 
  render(){

    return (
      <>
        <div>
          開催回 :　 
          <span>
            <select onChange={this.onChangeSelection}>
              { 
                this.state.holdings.map((holding_num, index) => {
                    let item_label = holding_num.toString()
                    if (holding_num === 0) {
                      item_label = "全て"
                    }
                    return <option value={ holding_num } key={index}>{ item_label }</option>
                  })
              }
            </select>
          </span>
        </div>   
        {this.barGraphList.map(barGraphItem => {
          return (
            <>
              <div>
                <h2>{barGraphItem.question}</h2>
                <BarGraph graphData={{ labels: this.labels, datasets: this.state.datasets[`${barGraphItem.datasets}`], }} />
              </div>
            </>
          );
        })}
      </>
   );

  }
}

export default GradeEvalGraphPanel; 