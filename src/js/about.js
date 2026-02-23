/**
 * About Page JavaScript
 * Renders team profiles from team.json.
 */

import teamData from '../components/data/team.json';

document.addEventListener('DOMContentLoaded', () => {
  renderTeam();
});

function renderTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;

  const members = teamData.members;
  grid.innerHTML = members.map(member => `
    <div class="team-card">
      <div class="team-card__photo">
        <img src="${member.image}" alt="${member.name}" loading="lazy">
      </div>
      <div class="team-card__info">
        <h3 class="team-card__name">${member.name}</h3>
        <p class="team-card__role">${member.role}</p>
        <p class="team-card__bio">${member.bio}</p>
        ${member.linkedin ? `
          <a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" class="btn btn--outline btn--sm">
            LinkedIn ↗
          </a>
        ` : ''}
      </div>
    </div>
  `).join('');
}
