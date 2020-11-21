function pickStat (data, key, faithful = false) {
  const unfaithful = data.unfaithful ?? {}
  return (!faithful && unfaithful[key]) || data[key]
}

export function formatStat (data, faithful = false) {
  return {
    ...data,
    types: pickStat(data, 'types', faithful),
    abilities: pickStat(data, 'abilities', faithful),
    evolutions: pickStat(data, 'evolutions', faithful),
    heldItems: pickStat(data, 'heldItems', faithful),
    gender: pickStat(data, 'gender', faithful),
    baseExp: pickStat(data, 'baseExp', faithful),
    catchRate: pickStat(data, 'catchRate', faithful),
    eggGroups: pickStat(data, 'eggGroups', faithful),
    hatchCycles: pickStat(data, 'hatchCycles', faithful),
    growthRate: pickStat(data, 'growthRate', faithful),
    baseStats: pickStat(data, 'baseStats', faithful),
    evYield: pickStat(data, 'evYield', faithful),
    movesByLevel: data.movesByLevel
      .concat((!faithful && data.unfaithful?.movesByLevel) || [])
      .sort((a, b) => a.level - b.level),
    movesByTMHM: data.movesByTMHM
      .concat((!faithful && data.unfaithful?.movesByTMHM) || []),
  }
}
