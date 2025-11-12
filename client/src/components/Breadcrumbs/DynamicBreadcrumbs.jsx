import React from 'react';
import { Breadcrumbs, Typography, Link } from '@mui/material';
import { useRouter } from 'next/router';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useSelector } from 'react-redux';

export default function DynamicBreadcrumbs() {
  const router = useRouter();
  const { group, institution, unit, subject } = router.query;

  const groups = useSelector((state) => state.institutionYear?.groups);

  let groupName = '';
  let institutionName = '';
  let unitName = '';
  let subjectName = '';

  const groupData = groups?.find((g) => g.slug === group);
  if (groupData) {
    groupName = groupData.name;

    const instData = groupData.institution?.find((i) => i.slug === institution);
    if (instData) {
      institutionName = instData.name;

      const unitData = instData.units?.find((u) => u.slug === unit);
      if (unitData) {
        unitName = unitData.name;

        const subjectData = unitData.subjects?.find((s) => s.slug === subject);
        if (subjectData) {
          subjectName = subjectData.name;
        }
      }
    }
  }

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      className='dark:bg-gray-800 dark:text-gray-100'
    >
      <Link underline="hover" color="inherit" href="/dashboard">
        Dashboard
      </Link>

      <Link underline="hover" color="inherit" href="/dashboard/question-bank">
        Question Bank
      </Link>

      {group && (
        <Link underline="hover" color="inherit" href={`/dashboard/question-bank/${group}`}>
          {groupName || group}
        </Link>
      )}

      {institution && (
        <Link
          underline="hover"
          color="inherit"
          href={`/dashboard/question-bank/${group}/${institution}`}
        >
          {institutionName || institution}
        </Link>
      )}

      {unit && (
        <Link
          underline="hover"
          color="inherit"
          href={`/dashboard/question-bank/${group}/${institution}/${unit}`}
        >
          {unitName || unit}
        </Link>
      )}

      {subject && (
        <Typography color="text.primary">
          {subjectName || subject}
        </Typography>
      )}
    </Breadcrumbs>
  );
}
