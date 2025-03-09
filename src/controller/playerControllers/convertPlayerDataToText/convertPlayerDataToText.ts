export const convertPlayerDataToText = (savedPlayer: any) => {
  // Handle cases where some player fields might be undefined or null
  const playerTextData = `
      Full Name: ${savedPlayer.fullName || 'N/A'}
      Nickname: ${savedPlayer.nickname || 'N/A'}
      Email: ${savedPlayer.email || 'N/A'}
      Mobile Phone: ${savedPlayer.mobilePhone || 'N/A'}
      Date of Birth: ${savedPlayer.dob || 'N/A'}
      Height: ${savedPlayer.height ? `${savedPlayer.height} cm` : 'N/A'}
      Weight: ${savedPlayer.weight ? `${savedPlayer.weight} kg` : 'N/A'}
      Started Playing: ${savedPlayer.startedPlaying || 'N/A'}
      Preferred Foot: ${savedPlayer.preferredFoot || 'N/A'}
      Preferred Handball: ${savedPlayer.preferredHandball || 'N/A'}
      Preferred Tap: ${savedPlayer.preferredTap || 'N/A'}
      Primary Position: ${savedPlayer.primaryPosition || 'N/A'}
      Secondary Position: ${savedPlayer.secondaryPosition || 'N/A'}
      Preferred Position: ${savedPlayer.preferredPosition || 'N/A'}
      Playing Style: ${savedPlayer.playingStyle || 'N/A'}
      Current Club: ${savedPlayer.currentClub || 'N/A'}
      Previous Clubs: ${
        savedPlayer.previousClubs && savedPlayer.previousClubs.length > 0
          ? savedPlayer.previousClubs.join(', ')
          : 'N/A'
      }
      Years of Experience: ${savedPlayer.yearsOfExperience || 'N/A'}
      Games Played: ${savedPlayer.gamesPlayed || 'N/A'}
      Goals Kicked: ${savedPlayer.goalsKicked || 'N/A'}
      Aspirations: ${savedPlayer.aspirations || 'N/A'}
      Achievements: ${
        savedPlayer.achievements && savedPlayer.achievements.length > 0
          ? savedPlayer.achievements.join(', ')
          : 'N/A'
      }
      Injury History: ${savedPlayer.injuryHistory || 'N/A'}
      Social Media Links: ${
        savedPlayer.socialMediaLinks &&
        Object.keys(savedPlayer.socialMediaLinks).length > 0
          ? JSON.stringify(savedPlayer.socialMediaLinks)
          : 'N/A'
      }
      Player Profile: ${savedPlayer.playerProfile || 'N/A'}
      Biography: ${savedPlayer.biography || 'N/A'}
    `
    .replace(/\s+/g, ' ')
    .trim(); // Remove excessive spaces and trim any leading/trailing spaces

  return playerTextData;
};
