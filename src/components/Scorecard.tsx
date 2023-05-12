import React from 'react';
import { InfoCard, OverflowTooltip } from '@backstage/core-components';
import { levelColor } from '../helpers/level_color_helper';
import CSS from 'csstype';


type Level = {
    index: number,
    name: string,
}

type Props = {
    levels: Array<Level>,
    levelCategories: Array<{level: { name: string }, category: { name: string }}> | undefined,
};

type State = {
    sortedLevels: Array<Level>
}

export class Scorecard extends React.Component<Props, State> {
    styles: Record<string, CSS.Properties> = {
        levelHeader: {
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.65)",
        },
        categoryHeaderCell: {
            padding: "5px",
            paddingBottom: "10px",
        },
        categoryHeader: {
            textAlign: "right",
            color: "rgba(0, 0, 0, 0.65)",
        },
        inactiveCategoryHeader: {
            textAlign: "right",
            color: "rgb(204, 204, 204)",
        },
        fieldCell: {
            textAlign: "center",
        },
        field: {
            display: "inline-block",
            width: "calc(100% - 10px)",
            height: "20px",
            marginLeft: "5px",
            marginRight: "5px",
            borderRadius: "2px",
            maxWidth: "70px",
        },
        inactiveField: {
            border: "1px solid #f5f5f5",
            backgroundColor: "#ffffff",
        },
        disabledField: {
            border: "1px solid #f5f5f5",
            backgroundColor: "#f5f5f5",
        }
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            sortedLevels: [...props.levels].sort((a: Level, b: Level) => (a.index - b.index))
        }
    }

    getFieldStyle(activeLevel: { name: string }, currentLevel: Level) {
        if(activeLevel === null) return {...this.styles.field, ...this.styles.disabledField};
        if(activeLevel.name !== currentLevel.name)
            return {...this.styles.field, ...this.styles.inactiveField};
        const color = levelColor(this.state.sortedLevels.length, this.state.sortedLevels.indexOf(currentLevel));
        return {
            ...this.styles.field,
            backgroundColor: color.secondary,
            border: `solid 1px ${color.secondary}`
        }
    }

    render() {
        return (
            <InfoCard title="Scorecard">
                <table style={{ width:"100%", backgroundColor: "rgba(255, 255, 255, 0.85)", borderRadius: "5px", tableLayout: "fixed" }}>
                    <thead>
                        <tr style={this.styles.levelHeader}>
                            <td style={{width: "25%"}}>&nbsp;</td>
                            {this.state.sortedLevels.map(level => (
                                <td key={`lvl_${level.name}`} style={this.styles.categoryHeaderCell}>
                                    <OverflowTooltip title={level.name} text={level.name} placement="top"/>
                                </td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {!!this.props.levelCategories && this.props.levelCategories.map(lc => (
                            <tr key={`cat_${lc.category.name}`}>
                                <td style={!!lc.level ? this.styles.categoryHeader : this.styles.inactiveCategoryHeader}>
                                    <OverflowTooltip title={lc.category.name} text={lc.category.name} placement="top"/>
                                </td>
                                {this.state.sortedLevels.map(level => (
                                    <td key={`cat_${lc.category.name}_lvl_${level.name}`} style={{width: `${75.0/this.state.sortedLevels.length}%`, ...this.styles.fieldCell}}><div style={this.getFieldStyle(lc.level, level)}/></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </InfoCard>
        );
    }
}